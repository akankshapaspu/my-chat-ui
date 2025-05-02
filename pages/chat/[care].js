// pages/chat/[care].js
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

// ensure cookies (session-token) go with every request
axios.defaults.withCredentials = true;

export default function ChatPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const care = router.query.care; // e.g. "preop" or your model path

  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");

  if (status === "loading") return <p>Loading…</p>;
  if (!session) return <p>Redirecting to sign in…</p>;

  const send = async () => {
    if (!input.trim()) return;
    setHistory((h) => [...h, { from: "user", text: input }]);

    try {
      const { data } = await axios.post(
        "/api/chat",
        { care, prompt: input },
        { withCredentials: true }
      );
      setHistory((h) => [...h, { from: "bot", text: data.text }]);
    } catch {
      setHistory((h) => [...h, { from: "bot", text: "Error contacting model." }]);
    }

    setInput("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chatbot: {care}</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflow: "auto" }}>
        {history.map((m, i) => (
          <p key={i}>
            <strong>{m.from}:</strong> {m.text}
          </p>
        ))}
      </div>
      <input
        style={{ width: "80%", marginRight: 8 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
