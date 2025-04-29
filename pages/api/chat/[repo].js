import { useSession } from "next-auth/react";
import { useState }    from "react";

export default function ChatPage({ repo }) {
  const { data: session } = useSession();
  const [question, setQuestion] = useState("");
  const [history, setHistory]     = useState([]);

  if (!session) {
    return <p>Please sign in to use the chat.</p>;
  }

  const send = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      credentials: "include",           // ← this is critical
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: repo, question }),
    });

    if (!res.ok) {
      console.error("chat error", await res.json());
      setHistory(h => [...h, { user: question, bot: "Error contacting model." }]);
      return;
    }

    const { text } = await res.json();
    setHistory(h => [...h, { user: question, bot: text }]);
    setQuestion("");
  };

  return (
    <div>
      <h1>Chatbot: {repo}</h1>
      <div style={{ border: "1px solid #ccc", padding: "1em" }}>
        {history.map((m, i) => (
          <p key={i}>
            <strong>user:</strong> {m.user} <br />
            <strong>bot:</strong> {m.bot}
          </p>
        ))}
      </div>
      <input
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Type your question…"
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
