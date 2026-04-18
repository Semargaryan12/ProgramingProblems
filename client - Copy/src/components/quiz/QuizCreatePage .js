import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import QuizForm from "./QuizForm";
import "./styles/quizCreatePage.css";

const QuizCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Check permissions
  if (user?.role !== "admin") {
    navigate("/unauthorizes");
    return null;
  }

  const validateQuizData = (quizData) => {
    if (!quizData.title || typeof quizData.title !== "string") {
      return "Թեստի անվանումը պարտադիր է:";
    }

    if (!quizData.language) return "Լեզուն պարտադիր է:";
    if (!Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      return "Առնվազն մեկ հարց է պահանջվում:";
    }
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      if (!q.text) return `Հարցի ${i + 1} տեքստը պարտադիր է:`;
      if (q.options.length < 2) return `${i + 1} հարցը պետք է ունենա առնվազն 2 տարբերակ:`;
      if (q.correctAnswerIndex === null) return `${i + 1} հարցի համար ընտրեք ճիշտ պատասխանը:`;
    }
    return null;
  };

  const handleSubmit = async (quizData) => {
    setLoading(true);
    setError(null);

    const validationError = validateQuizData(quizData);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to see error
      return;
    }

    try {
      await api.post("/quiz/create", quizData);
      alert("✅ Թեստը հաջողությամբ ստեղծվեց:");
      // Optionally navigate back to list: navigate("/admin/quizzes");
    } catch (err) {
      console.log(err);
      
      const msg = err.response?.data?.message || "Չհաջողվեց ստեղծել թեստ:";
      setError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      
      setLoading(false);
    }
  };

  return (
    <div className="code-quiz-container" data-loading={loading}>
      <h1 className="code-quiz-title">Ստեղծել նոր թեստ</h1>
      
      {error && (
        <div className="code-error">
          {error}
        </div>
      )}

      {/* Passing loading to the form if you want to disable buttons there too */}
      <QuizForm onSubmit={handleSubmit} loading={loading} />
      
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#00ffcc' }}>
          Մշակվում է...
        </div>
      )}
    </div>
  );
};

export default QuizCreatePage;