import React, { useState } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { api } from "../../api/api";
import "./styles/quizModal.css";

const QuizModal = ({ quiz, onClose }) => {
  const [answers, setAnswers] = useState(
    quiz.questions.map(() => ({ selectedAnswerIndex: null })),
  );
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnswerChange = (qIdx, answerIdx) => {
    if (score !== null || loading) return;
    setAnswers((prev) =>
      prev.map((ans, i) =>
        i === qIdx ? { selectedAnswerIndex: answerIdx } : ans,
      ),
    );
  };

  const isComplete = answers.every((a) => a.selectedAnswerIndex !== null);

  const handleSubmit = async () => {
    if (!isComplete) {
      setError("Խնդրում ենք պատասխանել բոլոր հարցերին:");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/quiz/solve/${quiz._id}`, { answers });
      setScore(response.data.data.score);
      // Give the user time to see their score before closing
      setTimeout(onClose, 3000);
    } catch (err) {
      const message =
        err.response?.data?.data?.message || "Տեղի է ունեցել սխալ:";
      const isAlreadyTaken =
        err.response?.status === 400 || message.includes("already");
      setError(isAlreadyTaken ? "Դուք արդեն անցել եք այս թեստը:" : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-x" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        <header className="modal-header">
          <h2 className="quiz-title">{quiz.title}</h2>
          <div className="progress-pill">
            {answers.filter((a) => a.selectedAnswerIndex !== null).length} /{" "}
            {quiz.questions.length} Լրացված
          </div>
        </header>

        <main className="modal-body">
          {score === null ? (
            quiz.questions.map((q, qIdx) => (
              <div key={qIdx} className="question-section">
                <p className="question-text">
                  {qIdx + 1}. {q.text}
                </p>
                <div className="options-list">
                  {q.options.map((opt, oIdx) => (
                    <label
                      key={oIdx}
                      className={`option-item ${answers[qIdx].selectedAnswerIndex === oIdx ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        checked={answers[qIdx].selectedAnswerIndex === oIdx}
                        onChange={() => handleAnswerChange(qIdx, oIdx)}
                      />
                      <span className="option-bullet">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="result-view">
              <FaCheckCircle className="success-icon" />
              <h3>Թեստն ավարտված է</h3>
              <div className="score-badge">
                {score} / {quiz.questions.length}
              </div>
              <p>Մոդալը կփակվի մի քանի վայրկյանից...</p>
            </div>
          )}
        </main>

        <footer className="modal-footer">
          {error && (
            <div className="error-banner">
              <FaExclamationTriangle /> {error}
            </div>
          )}

          {score === null && (
            <button
              className="submit-action-btn"
              onClick={handleSubmit}
              disabled={loading || !isComplete}
            >
              {loading ? (
                <>
                  <FaSpinner className="spin" /> Ուղարկվում է...
                </>
              ) : (
                "Հաստատել արդյունքը"
              )}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default QuizModal;
