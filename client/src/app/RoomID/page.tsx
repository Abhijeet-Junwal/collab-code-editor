"use client";
import React, { FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function RoomID() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const createNewRoom = (e: FormEvent) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room_ID & Username is required");
      return;
    }
    navigator.clipboard.writeText(roomId);

    router.push(`/Home/${roomId}`);
    toast.success("Room Created Successfully");
  };

  return (
    <>
      <div className="homePageWrapper">
        <div className="formWrapper">
          <h1 className="text-3xl font-bold p-4 m-2 mt-0 ml-0 pl-0">
            Collab Code Editor
          </h1>
          <h4 className="mainLabel">Paste invitation ROOM ID</h4>
          <div className="inputGroup ">
            <input
              type="text"
              className="inputBox text-black"
              placeholder="ROOM ID"
              onChange={(e) => setRoomId(e.target.value.trim())}
              value={roomId}
              // onKeyUp={handleInputEnter}
            />
            <input
              type="text"
              className="inputBox text-black"
              placeholder="USERNAME"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              // onKeyUp={handleInputEnter}
            />

            <button className="btn joinBtn text-black" onClick={joinRoom}>
              Join
            </button>
            <span className="createInfo">
              If you don&rsquo;t have an invite then create&nbsp;
              <a onClick={createNewRoom} href="" className="createNewBtn">
                new room
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomID;

/*
 * ===========================================================================================
 *                              NOTES — RoomID/page.tsx
 * ===========================================================================================
 *
 * PURPOSE: Allows users to create a new collaborative coding room or join an existing one using a Room ID and Username.
 * ROLE IN ARCHITECTURE: Frontend Page Layer. The primary gateway to the collaborative editor.
 * 
 * IMPORTS:
 * - `uuid`: Generates unique room IDs.
 * - `toast`: For UI notifications.
 * - `useRouter`: Next.js client-side navigation.
 * 
 * FUNCTION-BY-FUNCTION ANALYSIS:
 * - `createNewRoom(e)`
 *   - Does: Prevents default form submission, generates a v4 UUID, and sets it in the `roomId` state so the user can see/copy it before joining.
 * - `joinRoom()`
 *   - Does: Validates that both fields are filled. If valid, copies the Room ID to the user's clipboard automatically, pushes the route to `/Home/[roomId]`, and shows a success toast.
 * 
 * HOW THIS FILE CONNECTS TO OTHER FILES:
 * - Inbound: Rendered by the root `page.tsx`.
 * - Outbound: Navigates to `/Home/[roomId]`.
 * 
 * DESIGN PATTERNS:
 * - Controlled Components: The inputs for Room ID and Username are strictly controlled by React state (`value={roomId}`, `onChange`).
 * 
 * POTENTIAL INTERVIEW QUESTIONS:
 * 1. Why use `e.preventDefault()` in `createNewRoom`?
 *    - Answer: Even though it's called via an `onClick` on an `<a>` tag, preventing default stops the browser from appending a `#` to the URL or attempting a default navigation event, keeping it purely an SPA interaction.
 * 2. What is the purpose of `navigator.clipboard.writeText(roomId)` during join?
 *    - Answer: UX improvement. Since it's a collaborative tool, the user will immediately want to share the link/ID with friends. Copying it automatically saves them a step.
 */
