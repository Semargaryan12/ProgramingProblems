import "./styles/quizList.css";
import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

const QuizListAdmin = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/unauthorized");
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const response = await api.get("/quiz/all");
        setQuizzes(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Հարցաշարերը չհաջողվեց ստանալ։",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [navigate, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Վստա՞հ եք, որ ուզում եք ջնջել այս թեստը։")) return;
    try {
      await api.delete(`/quiz/delete/${id}`);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Հարցաշարը չհաջողվեց ջնջել։");
    }
  };

  const startEditing = (quiz) => {
    setEditingQuizId(quiz._id);
    setEditedTitle(quiz.title);
  };

  const cancelEditing = () => {
    setEditingQuizId(null);
    setEditedTitle("");
  };

  const saveTitle = async (id) => {
    try {
      await api.put(`/quiz/update/${id}`, { title: editedTitle });
      setQuizzes((prev) =>
        prev.map((q) => (q._id === id ? { ...q, title: editedTitle } : q)),
      );
      cancelEditing();
    } catch (err) {
      alert(err.response?.data?.message || "Վերնագիրը չհաջողվեց թարմացնել։");
    }
  };

  if (loading) {
    return (
      <div className="code-spinner-container">
        <div className="code-spinner"></div>
      </div>
    );
  }

  if (error) return <p className="code-error">{error}</p>;

  return (
    <div className="code-quiz-list-admin">
      <h1 className="code-page-title">Կառավարել թեստերը</h1>
      {quizzes.length === 0 ? (
        <p className="code-no-quizzes">Թեստեր չկան։</p>
      ) : (
        <ul className="code-quiz-list">
          {quizzes.map((q) => (
            <li key={q._id} className="code-quiz-item">
              {editingQuizId === q._id ? (
                <>
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="code-edit-input"
                  />
                  <button
                    onClick={() => saveTitle(q._id)}
                    className="code-admin-btn code-save-btn"
                  >
                    <FaCheck /> Պահպանել
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="code-admin-btn code-cancel-btn"
                  >
                    <FaTimes /> Չեղարկել
                  </button>
                </>
              ) : (
                <>
                  <span className="code-quiz-title">{q.title}</span>
                  <button
                    onClick={() => startEditing(q)}
                    className="code-admin-btn code-edit-btn"
                  >
                    <FaEdit /> Խմբագրել
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="code-admin-btn code-delete-btn"
                  >
                    <FaTrashAlt /> Ջնջել
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizListAdmin;
