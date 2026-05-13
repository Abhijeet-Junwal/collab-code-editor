"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useRef, useEffect, useCallback } from "react";
import * as monaco from "monaco-editor"; // Only for types
import { socket } from "@/lib/socket";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { RotateCcwIcon, TypeIcon } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import { debounce } from "lodash";
import axios from "axios";
import { backendUrl } from "@/lib/env";
import { useAssistantStore } from "@/store/useAssistantStore";
import Image from "next/image";
function EditorPanel() {
  const clerk = useClerk();
  const params = useParams();
  const roomId = typeof params?.roomid === "string" ? params.roomid : "";
  //for editor
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const pendingCodeRef = useRef<string | null>(null);
  const isRemoteChange = useRef(false);
  const setShowAssistant = useAssistantStore((state) => state.setShowAssistant);
  const setAssistantResponse = useAssistantStore(
    (state) => state.setAssistantResponse
  );

  const setEditor = useCodeEditorStore((state) => state.setEditor);

  const handleReceiveChanges = useCallback((data: string) => {
    updateEditorContent(data);
  }, []);

  useEffect(() => {
    if (!roomId) {
      return;
    }
    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log("[socket] connected", {
        id: socket.id,
        roomId,
      });
      socket.emit("join-room", { roomId: roomId }, (ack: any) => {
        if (!ack?.ok) {
          console.warn("[socket] join-room failed", ack?.error);
          return;
        }
        console.log("[socket] join-room ok", roomId);
      });
    };

    socket.on("connect", handleConnect);
    socket.on("receive-changes", handleReceiveChanges);
    socket.on("disconnect", (reason) => {
      console.warn("[socket] disconnect", reason);
    });
    socket.on("connect_error", (error) => {
      console.warn("[socket] connect_error", error?.message || error);
    });

    // Join immediately if already connected.
    if (socket.connected) {
      handleConnect();
    } else {
      console.log("[socket] waiting for connect", { roomId });
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive-changes", handleReceiveChanges);
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [roomId, handleReceiveChanges]);
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;
    setEditor(editor);
    if (pendingCodeRef.current) {
      isRemoteChange.current = true;
      editor.setValue(pendingCodeRef.current);
      console.log("Flushed pending code on mount");
      pendingCodeRef.current = null;
    }
    editor.addAction({
      id: "myPaste",
      label: "Ask AI for Suggestion",
      precondition: undefined,
      contextMenuGroupId: "MYPORTION",
      contextMenuOrder: 1.5,
      run: async (editor) => {
        const code = editor.getValue();
        const response = await axios.post(
          `${backendUrl}/api/ai/ask-suggestion`,
          {
            code,
          }
        );
        setShowAssistant(true);
        setAssistantResponse(response.data.answer);
        //         updateEditorContent(response.data.answer);
      },
    });
  };
  const emitCodeChange = useCallback(
    debounce((value: string) => {
      if (!roomId || !socket.connected) {
        console.warn("[socket] skip emit", {
          roomId,
          connected: socket.connected,
        });
        return;
      }
      console.log("[socket] emit code-change", { roomId, length: value.length });
      socket.emit("code-change", { roomId, code: value });
    }, 500),
    [roomId]
  );

  useEffect(() => {
    return () => {
      emitCodeChange.cancel();
    };
  }, [emitCodeChange]);
  const handleChange = (value: string | undefined) => {
    if (isRemoteChange.current) {
      console.log("[editor] ignore remote echo");
      isRemoteChange.current = false;
      return;
    }
    if (value !== undefined) {
      console.log("[editor] local change", { length: value.length });
      emitCodeChange(value);
    }
  };

  const updateEditorContent = (newCode: string) => {
    const editor = editorRef.current;
    if (editor && editor.getValue() !== newCode) {
      console.log("[editor] apply remote change", { length: newCode.length });
      const currentCode = editor.getValue();
      if (currentCode === newCode) return;

      const currentPosition = editor.getPosition();
      isRemoteChange.current = true;
      editor.setValue(newCode);
      if (currentPosition) {
        editor.setPosition(currentPosition);
      }
    } else {
      console.warn("[editor] not ready yet, caching remote change");
      pendingCodeRef.current = newCode;
    }
  };

  const { language, theme, fontSize, setFontSize } = useCodeEditorStore();

  const mounted = useMounted();

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const editor = editorRef.current;
    if (editor) editor.setValue(" ");
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    console.log(defaultCode);
    // if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    handleChange(value);
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image
                src={"/" + language + ".png"}
                alt="Logo"
                width={24}
                height={24}
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">
                Collab Code Editor
              </h2>
              <p className="text-xs text-gray-500">
                Write and execute your code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white ">Share</span>
            </motion.button> */}
          </div>
        </div>

        {/* Editor  */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {clerk.loaded && (
            <Editor
              height="600px"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={handleEditorDidMount}
              // onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
          )}

          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
      </div>
      {/* {isShareDialogOpen && <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />} */}
    </div>
  );
}
export default EditorPanel;
