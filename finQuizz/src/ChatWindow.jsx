import React, { useState } from 'react';

function ChatWindow({ quizHistory, onSend }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    const aiMsg = await onSend(newMessages);
    setMessages([...newMessages, { sender: 'ai', text: aiMsg }]);
    setInput('');
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: 370,
      background: '#23234b',
      color: '#f5f5f5',
      border: '1px solid #444',
      borderRadius: 8,
      boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      zIndex: 1000,
      padding: 16,
      maxHeight: 540,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{ marginBottom: 8, fontWeight: 'bold', fontSize: 18 }}>
        Chat with your Finance Teacher
      </div>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 8 }}>
        {messages.length === 0 && (
          <div style={{ color: '#bdbdbd', marginBottom: 8 }}>
            You can ask about any question you got right or wrong!
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '6px 0' }}>
            <span style={{
              background: msg.sender === 'user' ? '#8e44ad' : '#34495e',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: 14,
              display: 'inline-block',
              maxWidth: '80%',
              wordBreak: 'break-word',
              fontSize: 15
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{ color: '#bdbdbd' }}>Finance Teacher is typing...</div>}
      </div>
      <div>
        <input
          style={{
            width: '72%',
            padding: 7,
            borderRadius: 6,
            border: '1px solid #666',
            background: '#181836',
            color: '#fff',
            fontSize: 15
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            marginLeft: 8,
            padding: '7px 16px',
            background: '#8e44ad',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 'bold',
            fontSize: 15,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          Send
        </button>
      </div>
      <div style={{ marginTop: 12, fontSize: 13, color: '#bdbdbd' }}>
        <button
          style={{
            marginBottom: 4,
            background: '#34495e',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            padding: '4px 10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => setShowSummary(s => !s)}
        >
          {showSummary ? 'Hide' : 'Show'} Quiz Summary
        </button>
        {showSummary && (
          <div style={{
            maxHeight: 120,
            overflowY: 'auto',
            border: '1px solid #555',
            padding: 6,
            borderRadius: 4,
            background: '#181836'
          }}>
            <b style={{ color: '#fff' }}>Quiz Summary:</b>
            <ul style={{ paddingLeft: 16 }}>
              {quizHistory.map((q, i) => (
                <li key={i} style={{ color: q.wasCorrect ? '#2ecc71' : '#e74c3c', marginBottom: 6 }}>
                  <div style={{ fontWeight: 500 }}>{`Q${i + 1}: ${q.question}`}</div>
                  <div>Your answer: {q.choices[q.userAnswer]}</div>
                  <div>Correct: {q.choices[q.correct]}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;