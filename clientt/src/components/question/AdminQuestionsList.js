import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import "./styles/adminQuestionList.css";

const AdminQuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editedQuestionText, setEditedQuestionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleTokenError = (error) => {
    if (error.response && error.response.status === 401) {
      navigate("/unauthorized");
    } else {
      console.error("Request failed:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/questions");
      console.log(data);

      setQuestions(data.data);
      setError(null);
    } catch (err) {
      setError("Չհաջողվեց բեռնել հարցերը։");
      handleTokenError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      handleTokenError(err);
    }
  };

  const handleEditClick = (q) => {
    setEditingQuestionId(q._id);
    setEditedQuestionText(q.questionText);
  };

  const handleUpdate = async (id) => {
    if (!editedQuestionText.trim()) {
      alert("Խնդրում ենք մուտքագրել հարցի տեքստ։");
      return;
    }

    try {
      const updated = { questionText: editedQuestionText };
      await api.put(`/questions/${id}`, updated);

      setQuestions((prev) =>
        prev.map((q) => (q._id === id ? { ...q, ...updated } : q)),
      );
      setEditingQuestionId(null);
    } catch (err) {
      handleTokenError(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="page-background">
      <div className="questions-list-container">
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : questions.length === 0 ? (
          <p>Հարցեր դեռ չկան։</p>
        ) : (
          questions.map((q) => (
            <div
              key={q._id}
              className={`question-item ${
                editingQuestionId === q._id ? "խմբագրում" : ""
              }`}
            >
              {editingQuestionId === q._id ? (
                <>
                  <input
                    type="text"
                    value={editedQuestionText}
                    onChange={(e) => setEditedQuestionText(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                  <div className="admin-buttons">
                    <button
                      className="submit-btn"
                      onClick={() => handleUpdate(q._id)}
                    >
                      Պահպանել
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingQuestionId(null)}
                    >
                      Չեղարկել
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>{q.language}</h3>
                  <h3>{q.questionText}</h3>
                  <p>{q.description}</p>
                  <div className="admin-buttons">
                    <button
                      className="update-btn"
                      onClick={() => handleEditClick(q)}
                    >
                      խմբագրել
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(q._id)}
                    >
                      Հեռացնել
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminQuestionsList;
