// File: pages/chat/[model].js

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";

export default function Chat() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const modelId = decodeURIComponent(router.query.model || "");

  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);

  // If not signed in, redirect to NextAuth’s sign-in page
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // takes you to /api/auth/signin
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading…</div>;
  }

  // Send the prompt to your HF endpoint, including the session cookie
  const send = async () => {
    // Optimistically add the user message
    setHistory([...history, { role: "user", text: prompt }]);

    try {
      const { data } = await axios.post(
        "/api/chat",
        { model: modelId, prompt },
        {
          withCredentials: true,      // ← here’s the critical bit
        }
      );

      setHistory((h) => [
        ...h,
        { role: "bot", text: data.text || "No response from model." },
      ]);
    } catch (err) {
      console.error("chat error:", err);
      setHistory((h) => [
        ...h,
        { role: "bot", text: "Error contacting model." },
      ]);
    }

    setPrompt("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chatbot: {modelId}</h1>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 10,
          height: 300,
          overflowY: "auto",
          marginBottom: 12,
        }}
      >
        {history.map((m, i) => (
          <p key={i}>
            <strong>{m.role}:</strong> {m.text}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Type your question…"
        style={{ width: "80%", marginRight: 8 }}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
