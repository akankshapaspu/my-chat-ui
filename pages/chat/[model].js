// pages/chat/[model].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Chat() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const modelId = decodeURIComponent(router.query.model || "");

  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);

  // redirect to email‐magic‐link if logged out
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/api/auth/signin";
    }
  }, [status]);

  if (status === "loading") return <p>Loading…</p>;
  if (!session) return null;

  const send = async () => {
    try {
      const { data } = await axios.post(
        "/api/chat",
        { model: modelId, prompt },
        { withCredentials: true }  // ← ensure your session cookie goes with this call
      );

      setHistory((h) => [
        ...h,
        { role: "user", text: prompt },
        { role: "bot",  text: data.text },
      ]);
      setPrompt("");
    } catch (e) {
      console.error("send error", e);
      setHistory((h) => [
        ...h,
        { role: "user", text: prompt },
        { role: "bot",  text: "Error contacting model." },
      ]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chatbot: {modelId}</h1>
      <div
        style={{
          border: "1px solid #ddd",
          padding: 10,
          height: 300,
          overflow: "auto",
          marginBottom: 8,
        }}
      >
        {history.map((m, i) => (
          <p key={i}>
            <strong>{m.role}:</strong> {m.text}
          </p>
        ))}
      </div>
      <input
        style={{ width: "80%", marginRight: 8 }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your question…"
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
