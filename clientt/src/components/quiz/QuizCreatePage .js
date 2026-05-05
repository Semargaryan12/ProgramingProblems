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

  if (user?.role !== "admin") {
    navigate("/unauthorized");
    return null;
  }

  const validateQuizData = ({ title, language, questions }) => {
    if (!title?.trim()) return "Թեստի անվանումը պարտադիր է։";
    if (!language) return "Լեզուն պարտադիր է։";
    if (!questions?.length) return "Առնվազն մեկ հարց է պահանջվում։";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text) return `Հարց ${i + 1}–ի տեքստը պարտադիր է։`;
      if (q.options.length < 2) return `Հարց ${i + 1}–ը պետք է ունենա առնվազն 2 տարբերակ։`;
      if (q.correctAnswerIndex === null) return `Հարց ${i + 1}–ի համար ընտրեք ճիշտ պատասխանը։`;
    }
    return null;
  };

  const handleSubmit = async (quizData) => {
    setError(null);
    const validationError = validateQuizData(quizData);
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      await api.post("/quiz/create", quizData);
      navigate("/admin/quizzes");
    } catch (err) {
      setError(err.response?.data?.message || "Չհաջողվեց ստեղծել թեստ։");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qcp-page">
      <div className="qcp-inner">
        {error && (
          <div className="qcp-error" role="alert">
            <span className="qcp-error-dot" />
            {error}
          </div>
        )}
        <QuizForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default QuizCreatePage;