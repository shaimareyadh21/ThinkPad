import React, { useState } from 'react';

function Home({ onStart, defaultNumQuestions = 10, defaultTimePerQuestion = 5 }) {
  const [numQuestions, setNumQuestions] = useState(defaultNumQuestions);
  const [timePerQuestion, setTimePerQuestion] = useState(defaultTimePerQuestion);
  const [error, setError] = useState('');

  const handleStart = () => {
    const n = Number(numQuestions);
    const t = Number(timePerQuestion);

    if (!Number.isInteger(n) || n <= 0) {
      setError('Please enter a positive whole number for the number of questions.');
      return;
    }

    if (!Number.isInteger(t) || t <= 0) {
      setError('Please enter a positive whole number for the time per question.');
      return;
    }

    setError('');
    onStart(n, t);
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
      <button
        style={{
          backgroundColor: '#8e44ad',
          color: '#fff',
        }}
        onClick={handleStart}
      >
        Start Game
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default Home;