import React, { useState } from "react";
import { FaPlus, FaTrashAlt, FaCheck, FaLayerGroup, FaLanguage, FaTrophy } from "react-icons/fa";
import "./styles/quizForm.css";
import { LANGUAGES } from "../../constants/languages";
const QuizForm = ({ onSubmit, loading }) => {
  const initialQuestion = {
    text: "",
    options: ["", "", "", ""],
    correctAnswerIndex: null,
  };

  const [isFinal, setIsFinal] = useState(false);
  const [language, setLanguage] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([initialQuestion]);

  const updateQuestion = (qIndex, callback) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? callback(q) : q))
    );
  };

  const handleAddQuestion = () => setQuestions([...questions, { ...initialQuestion }]);

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    updateQuestion(qIndex, (q) => {
      const newOptions = [...q.options];
      newOptions[optIndex] = value;
      return { ...q, options: newOptions };
    });
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    updateQuestion(qIndex, (q) => {
      const newOptions = q.options.filter((_, i) => i !== optIndex);
      const newCorrectIndex = q.correctAnswerIndex === optIndex 
        ? null 
        : q.correctAnswerIndex > optIndex ? q.correctAnswerIndex - 1 : q.correctAnswerIndex;
      return { ...q, options: newOptions, correctAnswerIndex: newCorrectIndex };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = questions.every(
      (q) => q.options.filter((opt) => opt.trim()).length >= 2 && q.correctAnswerIndex !== null
    );

    if (!title.trim() || !language.trim()) {
      alert("Լրացրեք վերնագիրը և լեզուն:");
      return;
    }

    if (!isValid) {
      alert("Խնդրում ենք լրացնել բոլոր հարցերը և նշել ճիշտ պատասխանները:");
      return;
    }

    onSubmit({ title, language, isFinal, questions });
    
    // Reset form
    setTitle("");
    setIsFinal(false);
    setLanguage("");
    setQuestions([{ ...initialQuestion }]);
  };
const handleInputChange = (e) => {
  setLanguage(e.target.value);
};
  return (
    <div className="quiz-container">
      <header className="quiz-header-main">
        <div className="header-badge">Admin Constructor</div>
        <h2>Թեստի Ստեղծում</h2>
        
        <div className="main-fields-card">
          <div className="input-group">
            <label className="field-label"><FaLayerGroup /> Թեստի Անվանում</label>
            <input
              className="fancy-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="horizontal-fields">
            <div className="input-group flex-2">
  <label className="field-label"><FaLanguage /> Լեզու</label>
  <select
    className="fancy-sub-input" // Օգտագործեք նույն դասը, ինչ input-ների համար
    name="language"
    value={language}
    onChange={handleInputChange}
    required
  >
    <option value="">Ընտրել լեզուն</option>
    {LANGUAGES.map((lang) => (
      <option key={lang.value} value={lang.value}>
        {lang.label}
      </option>
    ))}
  </select>
</div>
            
            <div className="input-group flex-1">
              <label className="field-label"><FaTrophy /> Կարգավիճակ</label>
              <div 
                className={`final-toggle ${isFinal ? "active" : ""}`} 
                onClick={() => setIsFinal(!isFinal)}
              >
                <div className="toggle-slider"></div>
                <span>{isFinal ? "Միջանկյան" : "Վերջնական"}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="quiz-form">
        {questions.map((question, qIndex) => (
          <section key={qIndex} className="question-card">
            <div className="card-header">
              <span className="question-number">Հարց {qIndex + 1}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveQuestion(qIndex)}
                className="btn-icon delete"
              >
                <FaTrashAlt />
              </button>
            </div>

            <input
              className="question-text-input"
              type="text"
              value={question.text}
              onChange={(e) => updateQuestion(qIndex, (q) => ({ ...q, text: e.target.value }))}
              placeholder="Մուտքագրեք հարցը..."
              required
            />

            <div className="options-grid">
              {question.options.map((option, optIndex) => (
                <div 
                  key={optIndex} 
                  className={`option-row ${question.correctAnswerIndex === optIndex ? "is-correct" : ""}`}
                >
                  <div 
                    className="radio-indicator"
                    onClick={() => updateQuestion(qIndex, (q) => ({ ...q, correctAnswerIndex: optIndex }))}
                  >
                    {String.fromCharCode(65 + optIndex)}
                  </div>
                  
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    placeholder={`Տարբերակ ${optIndex + 1}`}
                    required
                  />

                  {question.options.length > 2 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveOption(qIndex, optIndex)}
                      className="btn-remove-opt"
                    >
                      <FaTrashAlt size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              type="button" 
              className="btn-add-opt" 
              onClick={() => updateQuestion(qIndex, (q) => ({ ...q, options: [...q.options, ""] }))}
            >
              <FaPlus /> Ավելացնել Տարբերակ
            </button>
          </section>
        ))}

        <footer className="form-actions">
          <button type="button" className="btn-secondary-action" onClick={handleAddQuestion}>
            <FaPlus /> Ավելացնել Հարց
          </button>
          <button type="submit" className="btn-primary-action" disabled={loading}>
            <FaCheck /> {loading ? "Մշակվում է..." : "Հաստատել Թեստը"}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default QuizForm;