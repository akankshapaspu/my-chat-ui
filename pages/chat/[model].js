// File: pages/chat/[model].js
import { useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function ModelChat() {
  const { data: session } = useSession()
  const router = useRouter()
  const { model } = router.query
  const [messages, setMessages] = useState([])

  const send = async text => {
    if (!session) return alert('Please sign in first')
    const newMsg = { role: 'user', content: text }
    setMessages(m => [...m, newMsg])

    try {
      const { data } = await axios.post('/api/chat',
        { model, messages: [...messages, newMsg] },
        { withCredentials: true }
      )
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error(err)
      setMessages(m => [...m, { role: 'assistant', content: 'Error contacting model.' }])
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    const text = e.target.elements.prompt.value
    if (!text.trim()) return
    send(text)
    e.target.reset()
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>🤖 Chatbot: {model}</h1>

      <div style={{
        border: '1px solid #ddd',
        padding: '1rem',
        minHeight: '300px',
        background:'#fafafa'
      }}>
        {messages.map((m, i) => (
          <p key={i}>
            <strong style={{ textTransform: 'capitalize' }}>{m.role}:</strong> {m.content}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '1rem' }}>
        <input
          name="prompt"
          type="text"
          placeholder="Type your question…"
          style={{
            flex: 1,
            padding: '.5rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px 0 0 4px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0 .75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderLeft: 'none',
            background: '#0070f3',
            color: 'white',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer'
          }}
        >Send</button>
      </form>
    </div>
  )
}
