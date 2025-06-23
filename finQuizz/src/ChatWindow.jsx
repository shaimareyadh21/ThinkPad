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
      width: 350,
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      zIndex: 1000,
      padding: 16,
      maxHeight: 500,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
        Chat with your Finance Teacher
      </div>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 8 }}>
        {messages.length === 0 && (
          <div style={{ color: '#888', marginBottom: 8 }}>
            You can ask about any question you got right or wrong!
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '4px 0' }}>
            <span style={{
              background: msg.sender === 'user' ? '#e0f7fa' : '#f1f8e9',
              padding: '6px 10px',
              borderRadius: 12,
              display: 'inline-block'
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{ color: '#888' }}>Finance Teacher is typing...</div>}
      </div>
      <div>
        <input
          style={{ width: '75%', padding: 6 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()} style={{ marginLeft: 8 }}>
          Send
        </button>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        <button
          style={{ marginBottom: 4 }}
          onClick={() => setShowSummary(s => !s)}
        >
          {showSummary ? 'Hide' : 'Show'} Quiz Summary
        </button>
        {showSummary && (
          <div style={{ maxHeight: 120, overflowY: 'auto', border: '1px solid #eee', padding: 4, borderRadius: 4, background: '#fafafa' }}>
            <b>Quiz Summary:</b>
            <ul style={{ paddingLeft: 16 }}>
              {quizHistory.map((q, i) => (
                <li key={i} style={{ color: q.wasCorrect ? 'green' : 'red', marginBottom: 6 }}>
                  <div style={{ fontWeight: 500 }}>Q{i + 1}: {q.question}</div>
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