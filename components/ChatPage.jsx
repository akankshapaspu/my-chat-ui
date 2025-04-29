// components/ChatPage.jsx
import { useState } from "react";

export default function ChatPage() {
  // ← your four HF model slugs
  const MODELS = [
    "Akanksha17/healthcare-assissted-model",
    "Akanksha17/healthcare-preop-model",
    "Akanksha17/healthcare-postop-model",
    "Akanksha17/healthcare-chronic-model",
  ];

  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input) return;
    // add user message
    setHistory((h) => [...h, { who: "user", text: input }]);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/chat/${encodeURIComponent(selectedModel)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",   // ← ensures your NextAuth cookie is sent
          body: JSON.stringify({ message: input }),
        }
      );
      const { text, error } = await res.json();
      if (error) throw new Error(error);
      setHistory((h) => [...h, { who: "bot", text }]);
    } catch (err) {
      console.error(err);
      setHistory((h) => [
        ...h,
        { who: "bot", text: "Error contacting model." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>📡 Pick a model & chat</h1>

      <div style={{ marginBottom: 12 }}>
        <label>
          Model:&nbsp;
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 4,
          padding: 12,
          minHeight: 240,
          marginBottom: 12,
        }}
      >
        {history.map((msg, i) => (
          <p key={i}>
            <strong>{msg.who}:</strong> {msg.text}
          </p>
        ))}
        {loading && <p><em>Thinking…</em></p>}
      </div>

      <div>
        <input
          style={{ width: "80%", padding: 8 }}
          placeholder="Type your question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button
          style={{ padding: "8px 16px", marginLeft: 8 }}
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
