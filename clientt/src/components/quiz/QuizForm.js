import React, { useState } from "react";
import { FaPlus, FaTrashAlt, FaCheck, FaLayerGroup, FaLanguage, FaTrophy } from "react-icons/fa";
import { LANGUAGES } from "../../constants/languages";
import "./styles/quizForm.css";

const initialQuestion = () => ({
  text: "",
  options: ["", "", "", ""],
  correctAnswerIndex: null,
});

const QuizForm = ({ onSubmit, loading }) => {
  const [isFinal, setIsFinal] = useState(false);
  const [language, setLanguage] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([initialQuestion()]);

  const updateQuestion = (qIndex, fn) =>
    setQuestions((prev) => prev.map((q, i) => (i === qIndex ? fn(q) : q)));

  const handleOptionChange = (qIndex, optIndex, value) =>
    updateQuestion(qIndex, (q) => {
      const options = [...q.options];
      options[optIndex] = value;
      return { ...q, options };
    });

  const handleRemoveOption = (qIndex, optIndex) =>
    updateQuestion(qIndex, (q) => {
      const options = q.options.filter((_, i) => i !== optIndex);
      const correct =
        q.correctAnswerIndex === optIndex ? null
        : q.correctAnswerIndex > optIndex ? q.correctAnswerIndex - 1
        : q.correctAnswerIndex;
      return { ...q, options, correctAnswerIndex: correct };
    });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !language) {
      alert("Լրացրեք վերնագիրը և լեզուն։");
      return;
    }

    const allValid = questions.every(
      (q) =>
        q.options.filter((o) => o.trim()).length >= 2 &&
        q.correctAnswerIndex !== null
    );

    if (!allValid) {
      alert("Լրացրեք բոլոր հարցերը և նշեք ճիշտ պատասխանները։");
      return;
    }

    onSubmit({ title, language, isFinal, questions });
    setTitle("");
    setLanguage("");
    setIsFinal(false);
    setQuestions([initialQuestion()]);
  };

  return (
    <div className="qf-wrap">
      {/* ── Meta ── */}
      <header className="qf-header">
        <span className="qf-eyebrow">Admin Constructor</span>
        <h2 className="qf-heading">Թեստի Ստեղծում</h2>

        <div className="qf-meta-card">
          <div className="qf-field">
            <label className="qf-label"><FaLayerGroup /> Անվանում</label>
            <input
              className="qf-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Թեստի անվանումը..."
              required
            />
          </div>

          <div className="qf-row">
            <div className="qf-field qf-field--grow">
              <label className="qf-label"><FaLanguage /> Լեզու</label>
              <select
                className="qf-input"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
              >
                <option value="">Ընտրել լեզուն</option>
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            <div className="qf-field">
              <label className="qf-label"><FaTrophy /> Կարգավիճակ</label>
              <button
                type="button"
                className={`qf-toggle ${isFinal ? "qf-toggle--on" : ""}`}
                onClick={() => setIsFinal((v) => !v)}
              >
                <span className="qf-toggle-dot" />
                {isFinal ? "Վերջնական" : "Միջանկյալ"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Questions ── */}
      <form onSubmit={handleSubmit} className="qf-form">
        {questions.map((question, qIndex) => (
          <section key={qIndex} className="qf-card">
            <div className="qf-card-head">
              <span className="qf-q-num">Հարց {qIndex + 1}</span>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="qf-icon-btn"
                  onClick={() => setQuestions((p) => p.filter((_, i) => i !== qIndex))}
                  aria-label="Remove question"
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>

            <input
              className="qf-input qf-input--question"
              type="text"
              value={question.text}
              onChange={(e) => updateQuestion(qIndex, (q) => ({ ...q, text: e.target.value }))}
              placeholder="Մուտքագրեք հարցը..."
              required
            />

            <div className="qf-options">
              {question.options.map((opt, optIndex) => (
                <div
                  key={optIndex}
                  className={`qf-option ${question.correctAnswerIndex === optIndex ? "qf-option--correct" : ""}`}
                >
                  <button
                    type="button"
                    className="qf-option-letter"
                    onClick={() => updateQuestion(qIndex, (q) => ({ ...q, correctAnswerIndex: optIndex }))}
                  >
                    {String.fromCharCode(65 + optIndex)}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    placeholder={`Տարբերակ ${optIndex + 1}`}
                  />
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      className="qf-icon-btn qf-icon-btn--sm"
                      onClick={() => handleRemoveOption(qIndex, optIndex)}
                      aria-label="Remove option"
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="qf-add-opt"
              onClick={() => updateQuestion(qIndex, (q) => ({ ...q, options: [...q.options, ""] }))}
            >
              <FaPlus /> Ավելացնել Տարբերակ
            </button>
          </section>
        ))}

        <footer className="qf-footer">
          <button
            type="button"
            className="qf-btn qf-btn--add"
            onClick={() => setQuestions((p) => [...p, initialQuestion()])}
          >
            <FaPlus /> Ավելացնել Հարց
          </button>
          <button
            type="submit"
            className="qf-btn qf-btn--submit"
            disabled={loading}
          >
            <FaCheck /> {loading ? "Մշակվում է..." : "Հաստատել Թեստը"}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default QuizForm;