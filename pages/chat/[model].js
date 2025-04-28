// pages/chat/[model].js
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { query } = useRouter();
  const model = query.model;
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  // you don't **have** to fetch /api/auth/session manually if you use useSession()

  const send = async () => {
    if (!message) return;
    setHistory((h) => [...h, { from: "user", text: message }]);
    setMessage("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",       // <— THIS IS CRITICAL
      body: JSON.stringify({ model, message }),
    });

    if (!res.ok) {
      setHistory((h) => [...h, { from: "bot", text: "Error contacting model." }]);
      return;
    }
    const { text } = await res.json();
    setHistory((h) => [...h, { from: "bot", text }]);
  };

  if (status === "loading") return <p>Loading…</p>;
  if (!session) return <p>Please sign in to chat</p>;

  return (
    <div>
      <h1>Chatbot: {model}</h1>
      <div style={{ border: "1px solid #ccc", padding: 8, minHeight: 200 }}>
        {history.map((m, i) => (
          <p key={i}>
            <strong>{m.from}:</strong> {m.text}
          </p>
        ))}
      </div>
      <input
        style={{ width: "80%" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
