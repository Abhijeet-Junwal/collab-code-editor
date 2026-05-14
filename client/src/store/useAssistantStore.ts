import { create } from "zustand";

type AssistantStore = {
  showAssistant: boolean;
  assistantResponse: string;
  userQuery: string;
  setUserQuery: (query: string) => void;
  setAssistantResponse: (response: string) => void;
  setShowAssistant: (show: boolean) => void;
};

export const useAssistantStore = create<AssistantStore>((set) => ({
  showAssistant: false,
  assistantResponse: "",
  userQuery: "",
  setShowAssistant: (show: boolean) => set({ showAssistant: show }),
  setAssistantResponse: (response: string) =>
    set({ assistantResponse: response }),
  setUserQuery: (query: string) => set({ userQuery: query }),
}));

/*
 * ===========================================================================================
 *                              NOTES — useAssistantStore.ts
 * ===========================================================================================
 *
 * PURPOSE: Manages the global state for the AI Assistant side panel.
 * ROLE IN ARCHITECTURE: Frontend State Management Layer. Uses Zustand to avoid prop drilling between the Editor, Header, and AI Assistant components.
 * 
 * IMPORTS:
 * - `create`: Zustand's store creator.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `useAssistantStore`
 *   - Does: Creates a global store holding the visibility state (`showAssistant`), the current user query, and the latest AI response.
 *   - Actions: `setShowAssistant`, `setAssistantResponse`, `setUserQuery` are simple setter functions mutating the state.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Used by `AI-Assistant.tsx` (to display chat), and `NavigationHeader.tsx` or `EditorPanel.tsx` (to toggle visibility or send code).
 * 
 * DESIGN PATTERNS:
 * - Global UI State Pattern: Centralizes UI toggle state so disjointed components in different parts of the React tree can interact with the side panel.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why use Zustand instead of React Context for this?
 *    - Answer: Zustand is simpler, requires less boilerplate, and prevents unnecessary re-renders. With Context, any change to the store re-renders all consumers. Zustand allows components to selectively subscribe only to the specific slices of state they need (e.g., `const show = useAssistantStore(s => s.showAssistant)`).
 */
