import React, { useEffect, useState, useContext, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { api } from "../../api/api";
import { LanguageContext } from "../../context/LanguageContext";
import { EditorController } from "./controllers/EditorController";
import { FaDownload, FaCode, FaTimes, FaPlay, FaRocket, FaTerminal } from "react-icons/fa";
import axios from "axios";
import "./styles/questionList.css";

/* --- REUSABLE LOADER COMPONENTS --- */
const Spinner = () => <div className="spinner"></div>;
const ButtonLoader = () => <span className="button-loader"></span>;

const UserQuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeInputs, setCodeInputs] = useState({});
  const [outputs, setOutputs] = useState({});
  const [uploading, setUploading] = useState({});
  const [isRunning, setIsRunning] = useState({});
  const [activeEditor, setActiveEditor] = useState(null);

  const { lang: globalLanguage } = useContext(LanguageContext);
  const token = localStorage.getItem("accessToken");

  const getMonacoLang = useCallback((lang) => {
    const map = { cpp: "cpp", python: "python", javascript: "javascript", java: "java" };
    return map[lang?.toLowerCase()] || "javascript";
  }, []);

  useEffect(() => {
    if (!globalLanguage || !token) return;

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/questions`, { params: { language: globalLanguage } });
        const data = res.data?.data || [];
        setQuestions(data);

        const initialCode = {};
        data.forEach((q) => {
          initialCode[q._id] = EditorController.getLocalCode(q._id);
        });
        setCodeInputs(initialCode);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [globalLanguage, token]);

  const handleRunCode = async (qId) => {
    setIsRunning((p) => ({ ...p, [qId]: true }));
    setOutputs((p) => ({ ...p, [qId]: "Running..." }));

    try {
      const res = await axios.post("http://localhost:5000/api/compiler/execute", {
        code: codeInputs[qId],
        language: globalLanguage.toLowerCase(),
      });
      setOutputs((p) => ({ ...p, [qId]: res.data.output || res.data.error }));
    } catch (err) {
      setOutputs((p) => ({ ...p, [qId]: `Error: ${err.message}` }));
    } finally {
      setIsRunning((p) => ({ ...p, [qId]: false }));
    }
  };

  const handleSubmitCode = async (qId) => {
    const code = codeInputs[qId];
    if (!code || code.trim().length < 10) return alert("Կոդի ծավալը փոքր է");

    setUploading((p) => ({ ...p, [qId]: true }));
    try {
      const question = questions.find(q => q._id === qId);
      const file = EditorController.generateFile(code, globalLanguage, question.questionText);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("laboratorId", qId);

      await api.post(`/questions/${qId}/answerq`, formData);
      alert("Հաջողությամբ տեղադրվեց!");
    } catch (err) {
      console.log("Submission failed:", err);
      alert("Ձախողվեց");
    } finally {
      setUploading((p) => ({ ...p, [qId]: false }));
    }
    
  };
    const formatLanguage = (lang) => {
  const map = {
    cpp: "C++",
    javascript: "JavaScript",
    python: "Python",
    java: "Java"
  };
  return map[lang?.toLowerCase()] || lang;
};
  return (
    <div className="workspace-layout">
     <header className="workspace-header">
  <div className="header-top">
    <h2>{formatLanguage(globalLanguage)} </h2>
    <span className="badge">առաջադրանքներ {questions.length} </span>
  </div>

  <div className="search-wrapper">
    <input
      type="text"
      placeholder="Փնտրել..."
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</header>

      <div className="questions-grid">
        {loading ? (
          <div className="loader-container">
            <Spinner />
            <p>Բեռնվում են հարցերը...</p>
          </div>
        ) : (
          questions
            .filter((q) => q.questionText.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((q) => (
              <div key={q._id} className={`question-card ${activeEditor === q._id ? "active" : ""}`}>
                <div className="card-main">
                  <div className="info">
                    <h3>{q.questionText}</h3>
                    <div className="description-section">
                      <label className="textbox-label">Նկարագրություն</label>
                      <textarea
                        className="description-textbox"
                        readOnly
                        value={q.subQuestion || "No description available."}
                      />
                    </div>
                  </div>
                  <div className="actions">
                    {q.hintUrl && (
                      <button className="btn-secondary" onClick={() => window.open(q.hintUrl, "_blank")}>
                        <FaDownload /> Hint
                      </button>
                    )}
                    <button
                      className="btn-primary"
                      onClick={() => setActiveEditor(activeEditor === q._id ? null : q._id)}
                    >
                      {activeEditor === q._id ? <FaTimes /> : <FaCode />}
                    </button>
                  </div>
                </div>

                {activeEditor === q._id && (
                  <div className="editor-section">
                    <div className="editor-controls">
                      <button 
                        onClick={() => handleRunCode(q._id)} 
                        disabled={isRunning[q._id]}
                        className="control-btn run-btn"
                      >
                        {isRunning[q._id] ? <ButtonLoader /> : <FaPlay />} 
                        {isRunning[q._id] ? " Compiling..." : " Run"}
                      </button>

                      <button 
                        onClick={() => EditorController.downloadCode(codeInputs[q._id], globalLanguage, q.questionText)}
                        className="control-btn"
                      >
                        <FaDownload /> Download
                      </button>

                      <button
                        className="btn-success control-btn"
                        onClick={() => handleSubmitCode(q._id)}
                        disabled={uploading[q._id]}
                      >
                        {uploading[q._id] ? <ButtonLoader /> : <FaRocket />} 
                        {uploading[q._id] ? " Submitting..." : " Submit"}
                      </button>
                    </div>

                    <div className="monaco-wrapper">
                      <Editor
                        height="350px"
                        theme="vs-dark"
                        language={getMonacoLang(globalLanguage)}
                        value={codeInputs[q._id]}
                        onChange={(val) => {
                          setCodeInputs((p) => ({ ...p, [q._id]: val }));
                          EditorController.saveLocalCode(q._id, val);
                        }}
                      />
                    </div>

                    {outputs[q._id] && (
                      <div className="terminal">
                        <div className="terminal-header">
                          <FaTerminal /> Console
                        </div>
                        <pre>{outputs[q._id]}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default UserQuestionsList;