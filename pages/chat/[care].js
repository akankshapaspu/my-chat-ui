// File: /pages/chat/[care].js
import { useRouter } from "next/router";
import { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function ChatPage() {
  const { query } = useRouter();
  const care = query.care; // e.g. "preop"
  const { data: session } = useSession();

  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");

  if (!session) {
    return <p>Loading…</p>;
  }

  const send = async () => {
    if (!input.trim()) return;
    // add user message
    setHistory((h) => [...h, { from: "user", text: input }]);
    try {
      const { data } = await axios.post(
        "/api/chat",
        { care, prompt: input },
        { withCredentials: true }
      );
      setHistory((h) => [...h, { from: "bot", text: data.text }]);
    } catch (e) {
      setHistory((h) => [
        ...h,
        { from: "bot", text: "Error contacting model." },
      ]);
    }
    setInput("");
  };

  return (
    <div>
      <h1>Chatbot: {care}</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflow: "auto" }}>
        {history.map((m, i) => (
          <p key={i}>
            <strong>{m.from}:</strong> {m.text}
          </p>
        ))}
      </div>
      <input
        style={{ width: "80%" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
