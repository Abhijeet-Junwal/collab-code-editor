"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useRef, useState } from "react";
import { LANGUAGE_CONFIG } from "../_constants";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import useMounted from "@/hooks/useMounted";

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useMounted();

  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguageObj = LANGUAGE_CONFIG[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const handleLanguageSelect = (langId: string) => {
  //   if (!hasAccess && langId !== "javascript") return;

  //   setLanguage(langId);
  //   setIsOpen(false);
  // };

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-3 px-4 py-2.5 bg-[#1e1e2e]/80 
      rounded-lg transition-all 
       duration-200 border border-gray-800/50 hover:border-gray-700`}
      >
        {/* Decoration */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 
        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />

        <div className="size-6 rounded-md bg-gray-800/50 p-0.5 group-hover:scale-110 transition-transform">
          <Image
            src={currentLanguageObj.logoPath}
            alt="programming language logo"
            width={24}
            height={24}
            className="w-full h-full object-contain relative z-10"
          />
        </div>

        <span className="text-gray-200 min-w-[80px] text-left group-hover:text-white transition-colors">
          {currentLanguageObj.label}
        </span>

        <ChevronDownIcon
          className={`size-4 text-gray-400 transition-all duration-300 group-hover:text-gray-300
            ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[#1e1e2e]/95 backdrop-blur-xl
           rounded-xl border border-[#313244] shadow-2xl py-2 z-50"
          >
            <div className="px-3 pb-2 mb-2 border-b border-gray-800/50">
              <p className="text-xs font-medium text-gray-400">
                Select Language
              </p>
            </div>

            <div className="max-h-[280px] overflow-y-auto overflow-x-hidden">
              {Object.values(LANGUAGE_CONFIG).map((lang, index) => {
                return (
                  <motion.div
                    key={lang.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group px-2"
                  >
                    <button
                      className={`
                      relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${
                        language === lang.id
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-gray-300"
                      }
                      hover:bg-[#262637]
                    `}
                      onClick={() => {
                        setLanguage(lang.id);
                        setIsOpen(false);
                      }}
                    >
                      {/* decorator */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg 
                      opacity-0 group-hover:opacity-100 transition-opacity"
                      />

                      <div
                        className={`
                         relative size-8 rounded-lg p-1.5 group-hover:scale-110 transition-transform
                         ${
                           language === lang.id
                             ? "bg-blue-500/10"
                             : "bg-gray-800/50"
                         }
                       `}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg 
                        opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <Image
                          width={24}
                          height={24}
                          src={lang.logoPath}
                          alt={`${lang.label} logo`}
                          className="w-full h-full object-contain relative z-10"
                        />
                      </div>

                      <span className="flex-1 text-left group-hover:text-white transition-colors">
                        {lang.label}
                      </span>

                      {/* selected language border */}
                      {language === lang.id && (
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500/30 rounded-lg"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}

                      {/* {isLocked ? (
                        <Lock className="w-4 h-4 text-gray-500" />
                      ) : (
                        language === lang.id && (
                          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                        )
                      )} */}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default LanguageSelector;

/*
 * ===========================================================================================
 *                              NOTES — LanguageSelector.tsx
 * ===========================================================================================
 *
 * PURPOSE: A custom dropdown component allowing users to switch the programming language of the editor.
 * ROLE IN ARCHITECTURE: Frontend Component Layer. Mutates the `language` state in the `useCodeEditorStore`.
 * 
 * IMPORTS:
 * - `useCodeEditorStore`: Zustand store.
 * - `LANGUAGE_CONFIG`: Constants defining supported languages and their IDs/logos.
 * - `framer-motion`: Used for dropdown animations.
 * - `useMounted`: Hydration fix.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `LanguageSelector()`
 *   - Does: Renders a button displaying the currently active language. Clicking it toggles an animated dropdown menu (`isOpen` state).
 * - `handleClickOutside` (in `useEffect`)
 *   - Does: Detects if the user clicked outside the dropdown box to auto-close it.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Rendered inside `Header.tsx`.
 * - Outbound: Mutates state in `useCodeEditorStore.ts`.
 * 
 * DESIGN PATTERNS:
 * - Custom Select UI: Replaces the native `<select>` element with a fully custom React component to allow for embedded images (logos) and animations.
 * - Click-Outside Pattern: Attaches a global document listener to handle closing the popover, a standard pattern for custom overlays.
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why do we need the `useMounted` hook here?
 *    - Answer: The `useCodeEditorStore` initializes by reading from `localStorage` (a browser-only API). During Server-Side Rendering, the server doesn't know what the user's preferred language is. If the component renders immediately, it will cause a hydration mismatch. `useMounted` delays the render until the client takes over.
 */
