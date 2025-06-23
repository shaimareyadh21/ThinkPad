import React, { useEffect, useState } from 'react';

function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/questions')
      .then(res => res.json())
      .then(setQuestions);
  }, []);

  const handleChoice = (idx) => {
    setSelected(idx);
    if (idx === questions[current].answer) setScore(score + 1);
    setTimeout(() => {
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  if (!questions.length) return <div>Loading...</div>;
  if (showScore) return <div>Your score: {score}/{questions.length}</div>;

  const q = questions[current];
  return (
    <div>
      <h2>{q.question}</h2>
      <ul>
        {q.choices.map((choice, idx) => (
          <li key={idx}>
            <button
              onClick={() => handleChoice(idx)}
              disabled={selected !== null}
              style={{
                background: selected === idx
                  ? idx === q.answer ? 'green' : 'red'
                  : ''
              }}
            >
              {choice}
            </button>
          </li>
        ))}
      </ul>
      <div>Question {current + 1} of {questions.length}</div>
    </div>
  );
}

export default App;