import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";
import { LANGUAGES } from "../../constants/languages";
import { api } from "../../api/api";
import "./styles/createQuestion.css";

const CreateQuestion = () => {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ language: "", text: "", description: "" });
  const [hintFile, setHintFile] = useState(null); // New state for file

  const questionInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("accessToken");

    if (!token || user?.role !== "admin") {
      navigate("/login");
    }
    questionInputRef.current?.focus();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleFileChange = (e) => {
    setHintFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      setStatus({ type: "error", message: "Խնդրում ենք լրացնել հարցի տեքստը:" });
      return;
    }

    try {
      setLoading(true);
      
      // Use FormData for file uploads
      const data = new FormData();
      data.append("language", formData.language);
      data.append("questionText", formData.text);
      data.append("subQuestion", formData.description);
      if (hintFile) {
        data.append("hintFile", hintFile); // Must match upload.single("hintFile")
      }

      await api.post("/questions", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({ type: "success", message: "Հարցը հաջողությամբ պահպանվեց:" });
      setFormData({ language: "", text: "", description: "" });
      setHintFile(null);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Սխալ:" });
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="admin-page-layout">
      <div className="admin-container">
        {/* Navigation Breadcrumb */}
        <nav className="admin-breadcrumb">
          <Link to="/admin/dashboard" className="back-link">
            <FaArrowLeft /> Հետ դեպի կառավարման վահանակ
          </Link>
        </nav>

        <header className="form-header">
          <div className="header-icon-box">
            <FaCloudUploadAlt />
          </div>
          <div className="header-text">
            <h1>Ստեղծել նոր առաջադրանք</h1>
          </div>
        </header>

        <div className="form-card">
          {status.message && (
            <div className={`alert-box ${status.type}`}>
              {status.type === "error" ? "⚠️" : "✅"} {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-group">
              <div className="input-group">
                <div className="input-group">
        <label htmlFor="hint">Օժանդակ ֆայլ (Hint File)</label>
        <input 
          type="file" 
          id="hint" 
          accept=".txt,.cpp,.py,.js" 
          onChange={handleFileChange}
          className="file-input"
        />
        {hintFile && <p className="file-name">Ընտրված է: {hintFile.name}</p>}
      </div>

      <div className="form-footer">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Պահպանվում է..." : "Պահպանել հարցը"}
        </button>
      </div>
                  <label>
               Լեզու
              <select
               name="language"
               value={formData.language}
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
             </label>
            </div>
              <label htmlFor="text">Առաջադրանքի թեման</label>
              <input
                id="text"
                name="text"
                type="text"
                ref={questionInputRef}
                value={formData.text}
                onChange={handleInputChange}
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div className="input-group">
              <label htmlFor="description">Լրացուցիչ նկարագրություն </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Մանրամասնեք հարցը կամ տվեք հուշումներ..."
                disabled={loading}
              />
            </div>

            <div className="form-footer">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setFormData({ text: "", description: "" })}
              >
                Չեղարկել
              </button>
              <button type="submit" className="btn-submit" disabled={loading}
             >
                {loading ? "Պահպանվել է." : "Պահպանել հարցը"}
                 
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
