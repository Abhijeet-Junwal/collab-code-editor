# Collab Code Editor — User Guide

Welcome to Collab Code Editor! This guide will walk you through the primary features of the platform and how to utilize it effectively for pair programming, interviews, or quick prototyping.

## 1. Getting Started

### Creating a Room
1. Navigate to the landing page.
2. Click the **"new room"** link located below the input fields. This will automatically generate a secure, unique Room ID (UUID).
3. Enter your **Username**.
4. Click **Join**. You will be redirected to the editor workspace, and the Room ID will be automatically copied to your clipboard.

### Joining a Room
1. If a colleague has already created a room, obtain the Room ID from them.
2. Paste the Room ID into the first input box on the landing page.
3. Enter your Username.
4. Click **Join**.

---

## 2. The Editor Workspace

### Writing Code
The central area is powered by the Monaco Editor (the same engine behind VS Code). It supports:
- Syntax highlighting
- Bracket matching
- Smooth scrolling
- Multi-cursor editing

### Customizing Your Environment
Located in the top right Header:
- **Theme Selector**: Choose between pre-installed premium themes like *VS Dark*, *Monokai*, *GitHub Dark*, and *Solarized Dark*.
- **Language Selector**: Switch the execution context. Supported languages include:
  - JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, Ruby, and Swift.
- **Font Size**: Use the slider next to the language settings to increase or decrease the code font size.

*(Note: Switching languages will automatically load a boilerplate template for that language. Your previous code in the old language is saved locally, so switching back will restore it.)*

---

## 3. Running Code

1. To execute your code, click the **Run Code** button in the top right (Play icon).
2. The execution process will begin, sending your code to an isolated sandbox (Judge0).
3. **The Output Panel** (located below or beside the editor, depending on your screen size) will display the results:
   - **Green Checkmark**: Successful execution, displaying the `stdout` (e.g., your `console.log` or `print` statements).
   - **Red Alert**: Execution failed. The panel will display the compilation error or runtime stack trace (`stderr`).
4. You can use the **Copy** button in the Output Panel to quickly copy the execution results to your clipboard.

---

## 4. Real-Time Collaboration

Collab Code Editor synchronizes your code in real-time.
- Any user who is in the exact same URL (`/Home/ROOM_ID`) will see the code update as you type.
- The synchronization is debounced slightly (500ms) to ensure smooth performance, meaning code appears on your colleague's screen about half a second after you stop typing.
- **Late Joiners**: If you join a room that has already been active, the server will automatically fetch the latest saved code from the database and populate your editor, ensuring you are immediately in sync with the team.

---

## 5. The AI Assistant

Stuck on a bug? Use the built-in AI Assistant powered by Together AI.

### Sidebar Chat
1. Click the floating **Robot Icon** in the bottom right corner of the screen to open the Assistant Sidebar.
2. You can drag the left edge of the sidebar to resize it.
3. Type your question in the input box.
4. **Context Aware**: You do not need to copy and paste your code into the chat. When you click Send, the application automatically attaches all the code currently visible in your editor to the prompt, allowing the AI to give highly specific, context-aware answers.

### Context Menu Integration
1. Highlight a piece of code in the editor.
2. Right-click to open the Monaco context menu.
3. Select **"Ask AI for Suggestion"**.
4. The Assistant Sidebar will automatically open with suggestions on how to improve, refactor, or fix the highlighted code.
