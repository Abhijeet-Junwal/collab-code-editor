import * as monaco from "monaco-editor";

export interface Theme {
  id: string;
  label: string;
  color: string;
}

export interface Language {
  id: string;
  label: string;
  logoPath: string;
  monacoLanguage: string;
  defaultCode: string;
  pistonRuntime: LanguageRuntime;
}

export interface LanguageRuntime {
  language: string;
  version: string;
}

export interface ExecuteCodeResponse {
  compile?: {
    output: string;
  };
  run?: {
    output: string;
    stderr: string;
  };
}

export interface ExecutionResult {
  code: string;
  output: string;
  error: string | null;
}

export interface CodeEditorState {
  language: string;
  output: string;
  isRunning: boolean;
  error: string | null;
  theme: string;
  fontSize: number;
  editor: monaco.editor.IStandaloneCodeEditor | null;
  executionResult: ExecutionResult | null;

  setEditor: (editor: monaco.editor.IStandaloneCodeEditor | null) => void;
  getCode: () => string;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  runCode: (code: string) => Promise<void>;
}

/*
 * ===========================================================================================
 *                              NOTES — types/index.ts
 * ===========================================================================================
 *
 * PURPOSE: Central repository for shared TypeScript interfaces across the frontend, specifically for the Code Editor state.
 * ROLE IN ARCHITECTURE: Frontend Types Layer. Defines the contracts for Zustand stores and UI components.
 * 
 * IMPORTS:
 * - `monaco-editor`: Used to type the `editor` instance reference.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `Theme, Language, LanguageRuntime` (Interfaces)
 *   - Does: Types the configuration objects for the UI selectors.
 * - `ExecuteCodeResponse, ExecutionResult` (Interfaces)
 *   - Does: Shapes the data returned from the code execution API (Judge0 or Piston).
 * - `CodeEditorState` (Interface)
 *   - Does: The complete type definition for the Zustand store managing the Monaco Editor.
 *   - Includes state values (`language`, `output`, `isRunning`, `editor` instance).
 *   - Includes actions/methods (`setEditor`, `runCode`, etc.).
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Used extensively by `useCodeEditorStore.ts` and components like `EditorPanel.tsx`.
 * 
 * DESIGN PATTERNS:
 * - Centralized Typing: Grouping domain-specific types into an `index.ts` allows clean imports across the application.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why store the `monaco.editor.IStandaloneCodeEditor` instance in the global Zustand state instead of just a local React ref?
 *    - Answer: Storing the editor instance globally allows *any* component to interact with the editor (e.g., a "Run" button in a header component can trigger `editor.getValue()` without needing complex prop drilling or context providers). However, it breaks Redux/Zustand best practices regarding non-serializable data in state.
 */
