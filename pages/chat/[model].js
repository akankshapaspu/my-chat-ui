// File: pages/chat/[model].js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import ChatInput from '../../components/ChatInput'
import axios from 'axios'

export default function ChatPage() {
  const router = useRouter()
  const { model } = router.query   // matches [model].js
  const [messages, setMessages] = useState([])

  async function sendQuestion(text) {
    setMessages(msgs => [...msgs, { role: 'user', text }])
    try {
      const { data } = await axios.post('/api/chat', { model, text }, { withCredentials: true })
      setMessages(msgs => [...msgs, data])
    } catch (err) {
      console.error(err)
      setMessages(msgs => [...msgs, { role: 'assistant', text: 'Error contacting model.' }])
    }
  }

  return (
    <Layout>
      <h1>Chatbot: {model}</h1>
      <div className="chat-window">
        {messages.map((m,i) =>
          <div key={i} className={`msg ${m.role}`}>{m.role}: {m.text}</div>
        )}
      </div>
      <ChatInput onSend={sendQuestion}/>
    </Layout>
  )
}
