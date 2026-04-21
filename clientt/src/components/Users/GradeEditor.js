import React, { useState } from "react";
import { api } from "../../api/api";
import "./GradeEditor.css";

const GradeEditor = ({ answerId, initialGrade, type }) => {
  const [grade, setGrade] = useState(initialGrade || 0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const endpoint =
        type === "lab" ? "/auth/grade-lab" : "/auth/grade-answer";
      await api.post(endpoint, { answerId, grade: Number(grade) });
      alert("Գնահատականը պահպանվեց");
    } catch (err) {
      alert("Սխալ պահպանման ժամանակ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        marginLeft: "20px",
      }}
    >
      <input
        type="number"
        value={grade}
        max={100}
        onChange={(e) => setGrade(e.target.value)}
        style={{
          width: "60px",
          padding: "5px",
          border: "1px solid #007bff",
          borderRadius: "4px",
        }}
        placeholder="Միավոր"
      />
      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          padding: "6px 12px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "..." : "Պահպանել"}
      </button>
    </div>
  );
};

export default GradeEditor;
