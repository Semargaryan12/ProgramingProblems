import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { LanguageContext } from "../../context/LanguageContext";
import {
  FaGraduationCap,
  FaQuestionCircle,
  FaArrowRight,
} from "react-icons/fa"; // Ավելացրել ենք սիրունիկ icon-ներ
import QuizModal from "./QuizModal";
import "./styles/quizSolver.css";

const QuizListUser = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { lang: language } = useContext(LanguageContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    if (!language) return;

    setLoading(true);
    setError(null); // Clear previous errors

    try {
      // 1. Create the 1-second timer promise
      const timer = new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. Start the API call
      const apiPromise = api.get(
        `/quiz/all?language=${encodeURIComponent(language)}`,
      );

      // 3. Wait for both to finish
      const [response] = await Promise.all([apiPromise, timer]);

      setQuizzes(response.data.data);
    } catch (err) {
      setError("Չհաջողվեց բեռնել թեստերը։ Խնդրում ենք փորձել փոքր-ինչ ուշ։");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/login");
      return;
    }
    if (!language) {
      navigate("/user");
      return;
    }
    fetchQuizzes();
  }, [language]);

  const formatLanguage = (lang) => {
    const map = {
      cpp: "C++",
      javascript: "JavaScript",
      python: "Python",
      java: "Java",
    };
    return map[lang?.toLowerCase()] || lang;
  };
  return (
    <div className="code-quiz-page">
      <header className="code-quiz-header">
        <div className="lang-badge">{formatLanguage(language)}</div>
        <h1>Հասանելի թեստեր</h1>
        <p>
          Անցեք թեստերը՝ ձեր գիտելիքները ստուգելու և նոր մակարդակներ բացելու
          համար
        </p>
      </header>

      {loading ? (
        <div className="code-spinner-container">
          <div className="code-loader"></div>
        </div>
      ) : error ? (
        <div className="code-error-container">
          <p className="code-error-message">{error}</p>
        </div>
      ) : (
        <div className="code-quiz-grid">
          {quizzes.length === 0 ? (
            <div className="code-no-quizzes">
              <FaQuestionCircle size={40} />
              <p>Այս լեզվով դեռևս թեստեր չկան։</p>
            </div>
          ) : (
            quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className={`code-quiz-card ${quiz.isFinal ? "final-exam-card" : ""}`}
                onClick={() => setSelectedQuiz(quiz)}
              >
                {/* Վերջնական թեստի նշանը (Badge) */}
                {quiz.isFinal && (
                  <div className="final-badge">
                    <FaGraduationCap /> <span>Final Exam</span>
                  </div>
                )}

                <div className="code-quiz-card-content">
                  {/* <div className="quiz-icon-wrapper">
                    <FaQuestionCircle className="quiz-card-icon" />
                  </div> */}
                  <h2>{quiz.title}</h2>
                  <div className="quiz-info-row">
                    <span>{quiz.questions.length} Հարց</span>
                    <span className="dot">•</span>
                  </div>
                  <button className="code-start-btn">
                    Սկսել թեստը <FaArrowRight />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedQuiz && (
        <QuizModal quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} />
      )}
    </div>
  );
};

export default QuizListUser;
