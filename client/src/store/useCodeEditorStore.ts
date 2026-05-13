import { CodeEditorState } from "./../types/index";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import { create } from "zustand";
import * as monaco from "monaco-editor";

const getInitialState = () => {
  // if we're on the server, return default values
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
    };
  }

  // if we're on the client, return values from local storage bc localStorage is a browser API.
  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || 16;

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
    javascript: 63,
    typescript: 74,
    python: 71,
    java: 62,
    cpp: 54,
    csharp: 51,
    go: 60,
    rust: 73,
    ruby: 72,
    swift: 83,
  };

  return {
    ...initialState,
    output: "",
    isRunning: false,
    error: null,
    editor: null as monaco.editor.IStandaloneCodeEditor | null,
    executionResult: null,

    getCode: () => get().editor?.getValue() || "",

    setEditor: (editor: monaco.editor.IStandaloneCodeEditor | null) => {
      if (editor) {
        const savedCode = localStorage.getItem(`editor-code-${get().language}`);
        if (savedCode) editor.setValue(savedCode);
      }

      set({ editor });
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setLanguage: (language: string) => {
      // Save current language code before switching
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);

      set({
        language,
        output: "",
        error: null,
      });
    },

    runCode: async (code: string) => {
      const { language } = get();
      console.log("Running code in language:", language); 

      if (!code) {
        set({ error: "Please enter some code" });
        return;
      }

      set({ isRunning: true, error: null, output: "" });

      try {
        const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
        console.log("Running code with runtime:", runtime);

        const languageId = JUDGE0_LANGUAGE_IDS[language];
        if (!languageId) {
          set({
            error: "Selected language is not supported by the code runner",
            executionResult: {
              code,
              output: "",
              error: "Selected language is not supported by the code runner",
            },
          });
          return;
        }

        const response = await fetch(
          "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              language_id: languageId,
              source_code: code,
            }),
          }
        );

        const data = await response.json();
        console.log("data back from judge0:", data);

        if (data?.message) {
          set({
            error: data.message,
            executionResult: { code, output: "", error: data.message },
          });
          return;
        }

        const compileError = data?.compile_output;
        const runtimeError = data?.stderr;
        const statusDescription = data?.status?.description;
        if (compileError || runtimeError) {
          const errorText = [compileError, runtimeError, statusDescription]
            .filter(Boolean)
            .join("\n\n");
          set({
            error: errorText,
            executionResult: {
              code,
              output: data?.stdout || "",
              error: errorText,
            },
          });
          return;
        }

        if (statusDescription && statusDescription !== "Accepted") {
          set({
            error: statusDescription,
            executionResult: {
              code,
              output: data?.stdout || "",
              error: statusDescription,
            },
          });
          return;
        }

        const output = data?.stdout || "";
        set({
          output: output.trim(),
          error: null,
          executionResult: {
            code,
            output: output.trim(),
            error: null,
          },
        });
      } catch (error) {
        console.log("Error running code:", error);
        set({
          error: "Error running code",
          executionResult: { code, output: "", error: "Error running code" },
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

export const getExecutionResult = () =>
  useCodeEditorStore.getState().executionResult;
