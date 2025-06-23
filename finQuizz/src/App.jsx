import React, { useEffect, useState } from 'react';
import Home from './Home.jsx';
import ChatWindow from './ChatWindow.jsx';
import './index.css';


function getRandomQuestions(allQuestions, count) {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Dummy AI API call for explanation/chat (replace with your real API)
async function fetchAIResponse(messages, quizHistory) {
  if (messages.length === 0) {
    return `Hi! I'm your finance teacher. Ask me about any question you got right or wrong, and I'll help you understand.`;
  }
  return "That's a great question! [AI would answer here, using your quiz history for context]";
}

function Quiz({ numQuestions, timePerQuestion, onRestart }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);

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
      setTimeLeft(timePerQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleChoice = (idx) => {
    const isCorrect = idx === questions[current].answer;
    setSelected(idx);
    setQuizHistory(history => [
      ...history,
      {
        question: questions[current].question,
        choices: questions[current].choices,
        correct: questions[current].answer,
        userAnswer: idx,
        wasCorrect: isCorrect
      }
    ]);
    if (isCorrect) setScore(score + 1);
    setTimeout(() => {
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setTimeLeft(timePerQuestion);
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
      <div className="quiz-complete" style={{ textAlign: 'center', position: 'relative' }}>
        <h2>Quiz Complete!</h2>
        <p>Your score: <b>{score}</b> out of <b>{questions.length}</b></p>
        <p>{message}</p>
        {!showChat && (
          <button onClick={() => setShowChat(true)}>Chat with Finance Teacher</button>
        )}
        <br />
        <button onClick={onRestart} style={{ marginTop: 10 }}>Play Again</button>
        {showChat && (
          <ChatWindow
            quizHistory={quizHistory}
            onSend={async (messages) => fetchAIResponse(messages, quizHistory)}
          />
        )}
      </div>
    );
  }

  const q = questions[current];
  const progress = (timeLeft / timePerQuestion) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-card">
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
                      ? '#4CAF50' // Green for correct
                      : '#F44336' // Red for incorrect
                    : '#8e44ad', // Default purple
                }}
              >
                {choice}
              </button>
            </li>
          ))}
        </ul>
        <div>Question {current + 1} of {questions.length}</div>
      </div>
    </div>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(5); // Default time

  return started
    ? <Quiz
        numQuestions={numQuestions}
        timePerQuestion={timePerQuestion}
        onRestart={() => setStarted(false)}
      />
    : <Home
        onStart={(n, time) => {
          setNumQuestions(n);
          setTimePerQuestion(time);
          setStarted(true);
        }}
        defaultNumQuestions={numQuestions}
        defaultTimePerQuestion={timePerQuestion}
      />;
}

export default App;