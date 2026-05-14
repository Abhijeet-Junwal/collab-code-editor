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

/*
 * ===========================================================================================
 *                              NOTES — useCodeEditorStore.ts
 * ===========================================================================================
 *
 * PURPOSE: Centralized state management for the Monaco Code Editor, handling language selection, themes, code execution, and results.
 * ROLE IN ARCHITECTURE: Frontend State Layer. The heaviest store in the app, orchestrating the interaction between the editor UI and the Judge0 execution API.
 * 
 * IMPORTS:
 * - `zustand`: State management.
 * - `LANGUAGE_CONFIG`: Constants defining supported languages.
 * - `monaco-editor`: For typing the editor instance.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `getInitialState()`
 *   - Does: Safely fetches the last used theme, language, and font size from `localStorage`. Returns safe defaults during Server-Side Rendering.
 * 
 * - `useCodeEditorStore` (Zustand creation)
 *   - `setEditor`: Stores the Monaco instance globally and loads any previously saved code for the current language into it.
 *   - `setTheme`, `setFontSize`, `setLanguage`: Updates the state and synchronizes the choice to `localStorage` for persistence across reloads. It caches the *current* language's code before switching.
 *   - `runCode(code)`: 
 *     1. Sets loading state (`isRunning: true`).
 *     2. Maps the language to a Judge0 ID.
 *     3. Makes a POST request to the Judge0 API (`ce.judge0.com`) with the source code.
 *     4. Parses the response, handling compilation errors, runtime errors (`stderr`), or successful outputs (`stdout`).
 *     5. Updates the `executionResult` state so the OutputPanel can display the result.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Used by `EditorPanel.tsx`, `LanguageSelector.tsx`, `ThemeSelector.tsx`, `RunButton.tsx`, `OutputPanel.tsx`.
 * - Outbound: Calls Judge0 REST API.
 * 
 * DESIGN PATTERNS:
 * - Facade Pattern: The store hides the complexity of interacting with `localStorage`, the Monaco editor instance, and the Judge0 API behind simple methods like `setLanguage` and `runCode`.
 * - Local-First Cache Pattern: Synchronizes state to `localStorage` to ensure the user doesn't lose their work on a page refresh.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. You are storing the Monaco `editor` instance in Zustand state. Is this an anti-pattern?
 *    - Answer: In strict functional state management (like Redux), yes, because the editor instance contains DOM references, classes, and circular references, making it non-serializable. Zustand is more lenient, but it can still cause memory leaks if not carefully cleaned up on component unmount.
 * 2. How does the app remember what I typed in Python when I switch to Java and back?
 *    - Answer: Inside `setLanguage`, right before updating the language state, it grabs the current code from the editor and saves it to `localStorage` under `editor-code-[language]`. When switching back, `setEditor` reads from that specific cache.
 * 3. Why pass `wait=true` to the Judge0 API?
 *    - Answer: Judge0 handles code execution asynchronously. If `wait=false`, it returns a token immediately, and you have to poll a different endpoint to check if execution finished. `wait=true` holds the HTTP connection open until the execution completes, simplifying the frontend logic.
 */
