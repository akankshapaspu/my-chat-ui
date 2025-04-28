// File: pages/chat/[model].js
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Chat() {
  const router = useRouter();
  const modelId = decodeURIComponent(router.query.model || "");
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const bottomRef = useRef();

  // Scroll to bottom when history updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const send = async () => {
    if (!prompt.trim()) return;
    setHistory((h) => [...h, { role: "user", text: prompt }]);
    setPrompt("");
    try {
      const { data } = await axios.post("/api/chat", {
        model: modelId,
        prompt,
      });
      setHistory((h) => [...h, { role: "assistant", text: data.text }]);
    } catch (err) {
      setHistory((h) => [...h, { role: "assistant", text: "Error contacting model." }]);
    }
  };

  if (!modelId) return <p>Loading…</p>;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Chatbot: {modelId.split("/").pop()}</h1>
      <div
        style={{
          border: "1px solid #ddd",
          padding: 10,
          height: 400,
          overflowY: "auto",
          background: "#fafafa",
        }}
      >
        {history.map((m, i) => (
          <p key={i}>
            <strong>{m.role}:</strong> {m.text}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          style={{ width: "80%", marginRight: 8 }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question…"
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
