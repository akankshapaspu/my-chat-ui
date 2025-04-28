import { useRouter } from "next/router"
import { useState } from "react"
import axios from "axios"

export default function Chat() {
  const { query } = useRouter()
  const modelId = decodeURIComponent(query.model || "")
  const [prompt, setPrompt] = useState("")
  const [history, setHistory] = useState([])

  const send = async () => {
    const { data } = await axios.post("/api/chat", { model: modelId, prompt })
    setHistory([
      ...history,
      { role: "user", text: prompt },
      { role: "bot",  text: data.text },
    ])
    setPrompt("")
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Chatbot: {modelId}</h1>
      <div style={{
        border: "1px solid #ddd",
        padding: 10,
        height: 300,
        overflow: "auto"
      }}>
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
        placeholder="Type your question..."
      />
      <button onClick={send}>Send</button>
    </div>
  )
}
