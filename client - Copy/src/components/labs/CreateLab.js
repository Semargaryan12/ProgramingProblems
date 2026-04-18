import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import "./styles/CreateLab.css";

const CreateLab = () => {
  const [title, setTitle] = useState("");
  const [subQuestion, setSubQuestion] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/unauthorized");
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/labs", { title, subQuestion });

      // ✅ Clear fields after successful submit
      setTitle("");
      setSubQuestion("");

    } catch (err) {
      console.log(err);
      setError("Լաբորատորիան ստեղծելիս տեղի ունեցավ սխալ:");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setSubQuestion("");
    setError("");
  };

  return (
    <div className="create-lab-page">
      <h2 className="create-lab-title">Ստեղծել նորը</h2>
      {error && <p className="create-lab-error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="create-lab-form">
        <input
          type="text"
          placeholder="Վերնագիր"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="create-lab-input"
        />

        <textarea
          placeholder="Բովանդակություն"
          value={subQuestion}
          onChange={(e) => setSubQuestion(e.target.value)}
          required
          className="create-lab-textarea"
        />

        <button 
          type="button" 
          className="btn-ghost"
          onClick={handleCancel}
        >
          Չեղարկել
        </button>

        <button type="submit" className="create-lab-button">
          Ստեղծել
        </button>
      </form>
    </div>
  );
};

export default CreateLab;