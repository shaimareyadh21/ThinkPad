import React, { useState } from 'react';

function Home({ onStart, defaultNumQuestions = 10 }) {
  const [numQuestions, setNumQuestions] = useState(defaultNumQuestions);
  const [error, setError] = useState('');

  const handleStart = () => {
    const n = Number(numQuestions);
    if (!Number.isInteger(n) || n <= 0) {
      setError('Please enter a positive whole number.');
      return;
    }
    setError('');
    onStart(n);
  };

  return (
    <div>
      <h1>Welcome to FinQuizz!</h1>
      <label>
        Number of questions:&nbsp;
        <input
          type="number"
          min="1"
          value={numQuestions}
          onChange={e => setNumQuestions(e.target.value)}
        />
      </label>
      <button onClick={handleStart}>Start Game</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default Home;