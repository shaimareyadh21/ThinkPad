import React, { useEffect, useState } from 'react';
import Home from './Home.jsx';
import './index.css';

const TIME_FOR_QUESTION = 5; // seconds

function getRandomQuestions(allQuestions, count) {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function Quiz({ numQuestions, onRestart }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_FOR_QUESTION);

  useEffect(() => {
    fetch('http://localhost:4000/api/questions')
      .then(res => res.json())
      .then(allQuestions => {
        const n = Math.min(numQuestions, allQuestions.length);
        setQuestions(getRandomQuestions(allQuestions, n));
      });
  }, [numQuestions]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleTimeout = () => {
    setSelected(null);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setTimeLeft(TIME_FOR_QUESTION);
    } else {
      setShowScore(true);
    }
  };

  const handleChoice = (idx) => {
    setSelected(idx);
    if (idx === questions[current].answer) setScore(score + 1);
    setTimeout(() => {
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setTimeLeft(TIME_FOR_QUESTION);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  if (!questions.length) return <div>Loading...</div>;

  if (showScore) {
    let message = "Good effort!";
    if (score === questions.length) message = "Perfect score! Excellent!";
    else if (score > questions.length * 0.7) message = "Great job!";
    else if (score < questions.length * 0.4) message = "Keep practicing!";

    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Quiz Complete!</h2>
        <p>Your score: <b>{score}</b> out of <b>{questions.length}</b></p>
        <p>{message}</p>
        <button onClick={onRestart}>Play Again</button>
      </div>
    );
  }

  const q = questions[current];
  const progress = (timeLeft / TIME_FOR_QUESTION) * 100;

  return (
    <div>
      <h2>{q.question}</h2>
      <div className="timer-container">
        <div
          className="timer-bar"
          style={{ '--progress': `${progress}%` }}
        ></div>
        <div className="timer">{timeLeft}</div>
      </div>
      <ul>
        {q.choices.map((choice, idx) => (
          <li key={idx}>
            <button
              onClick={() => handleChoice(idx)}
              disabled={selected !== null}
              style={{
                background: selected === idx
                  ? idx === q.answer
                    ? 'green'
                    : 'red'
                  : '',
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

function App() {
  const [started, setStarted] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);

  return started
    ? <Quiz numQuestions={numQuestions} onRestart={() => setStarted(false)} />
    : <Home onStart={n => { setNumQuestions(n); setStarted(true); }} defaultNumQuestions={numQuestions} />;
}

export default App;