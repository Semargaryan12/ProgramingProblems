import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import Editor from "@monaco-editor/react";
import { api } from "../../api/api";
import { LanguageContext } from "../../context/LanguageContext";
import { EditorController } from "./controllers/EditorController";
import {
  FaDownload,
  FaCode,
  FaPlay,
  FaRocket,
  FaTerminal,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import "./styles/questionList.css";

/* ─── Micro-components ─────────────────────────────── */

const Spinner = () => (
  <div className="spinner-wrap">
    <div className="ring-spinner" />
    <span>Բեռնվում է...</span>
  </div>
);

const ButtonLoader = () => <span className="btn-dot-loader" />;

const Toast = ({ message, type, onClose }) => (
  <div className={`toast toast--${type}`} role="alert">
    {type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
    <span>{message}</span>
    <button className="toast-close" onClick={onClose} aria-label="Close">
      ×
    </button>
  </div>
);

/* ─── Helpers ───────────────────────────────────────── */

const LANG_MAP = {
  cpp: "C++",
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
};

const MONACO_LANG_MAP = {
  cpp: "cpp",
  python: "python",
  javascript: "javascript",
  java: "java",
};

const formatLanguage = (lang) => LANG_MAP[lang?.toLowerCase()] || lang;
const getMonacoLang = (lang) =>
  MONACO_LANG_MAP[lang?.toLowerCase()] || "javascript";

/* ─── Main component ────────────────────────────────── */

const UserQuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeInputs, setCodeInputs] = useState({});
  const [outputs, setOutputs] = useState({});
  const [uploading, setUploading] = useState({});
  const [isRunning, setIsRunning] = useState({});
  const [activeEditor, setActiveEditor] = useState(null);
  const [toast, setToast] = useState(null);

  const abortRef = useRef(null);
  const { lang: globalLanguage } = useContext(LanguageContext);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  /* ── Fetch questions ──────────────────────────────── */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!globalLanguage || !token) return;

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const fetchQuestions = async () => {
      setLoading(true);
      setQuestions([]);
      try {
        const res = await api.get(`/questions`, {
          params: { language: globalLanguage },
          signal: abortRef.current.signal,
        });
        const data = res.data?.data || [];
        setQuestions([...data].reverse());

        const initialCode = {};
        data.forEach((q) => {
          initialCode[String(q._id)] =
            EditorController.getLocalCode(q._id) ?? "";
        });
        setCodeInputs(initialCode);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Fetch error:", err);
          showToast("Հարցերը բեռնելը ձախողվեց", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
    return () => abortRef.current?.abort();
  }, [globalLanguage, showToast]);

  /* ── ESC closes editor ────────────────────────────── */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveEditor(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ── Run code ─────────────────────────────────────── */
  const handleRunCode = useCallback(
    async (qId) => {
      const code = codeInputs[qId];
      if (!code?.trim()) {
        showToast("Կոդ գրված չէ", "error");
        return;
      }

      setIsRunning((p) => ({ ...p, [qId]: true }));
      setOutputs((p) => ({ ...p, [qId]: "⏳ Կատարվում է..." }));

      try {
        const res = await axios.post(
          "http://localhost:5000/api/compiler/execute",
          { code, language: globalLanguage.toLowerCase() },
          { timeout: 30000 },
        );
        const result = res.data?.output ?? res.data?.error ?? "✓ Ելք չկա";
        setOutputs((p) => ({ ...p, [qId]: result }));
      } catch (err) {
        const msg = err.response?.data?.error || err.message || "Անհայտ սխալ";
        setOutputs((p) => ({ ...p, [qId]: `❌ Error: ${msg}` }));
      } finally {
        setIsRunning((p) => ({ ...p, [qId]: false }));
      }
    },
    [codeInputs, globalLanguage, showToast],
  );

  /* ── Submit code ──────────────────────────────────── */
  const handleSubmitCode = useCallback(
    async (qId) => {
      const code = codeInputs[qId];
      if (!code || code.trim().length < 10) {
        showToast("Կոդը շատ փոքր է", "error");
        return;
      }

      setUploading((p) => ({ ...p, [qId]: true }));
      try {
        const question = questions.find((q) => String(q._id) === String(qId));
        if (!question) {
          showToast("Հարցը չի գտնվել", "error");
          return;
        }

        const file = EditorController.generateFile(
          code,
          globalLanguage,
          question.questionText,
        );
        const formData = new FormData();
        formData.append("file", file);
        formData.append("laboratorId", qId);

        await api.post(`/questions/${qId}/answerq`, formData);
        showToast("Հաջողությամբ ուղարկվեց! 🎉", "success");
      } catch (err) {
        console.error("Submission error:", err);
        showToast(err.response?.data?.message || "Սխալ տեղի ունեցավ", "error");
      } finally {
        setUploading((p) => ({ ...p, [qId]: false }));
      }
    },
    [codeInputs, questions, globalLanguage, showToast],
  );

  /* ── Code change ──────────────────────────────────── */
  const handleCodeChange = useCallback((val, qId) => {
    setCodeInputs((p) => ({ ...p, [qId]: val ?? "" }));
    EditorController.saveLocalCode(qId, val ?? "");
  }, []);

  const filtered = [...questions]
    .reverse()
    .filter((q) =>
      q.questionText?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const activeQuestion = activeEditor
    ? questions.find((q) => String(q._id) === activeEditor)
    : null;

  /* ─────────────────────────────────────────────────── */
  return (
    <div className="workspace-layout">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {activeEditor === null ? (
        /* ══════════ LIST VIEW ══════════ */
        <>
          <header className="workspace-header">
            <div className="header-top">
              <div className="header-title-group">
                <h2 className="header-lang">
                  {formatLanguage(globalLanguage)}
                </h2>
                <span className="badge">{questions.length} Առաջադրանք</span>
              </div>
              <div className="search-wrapper">
                <input
                  type="search"
                  placeholder="Փնտրել առաջադրանքը..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search questions"
                />
              </div>
            </div>
          </header>

          {loading ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <FaCode className="empty-icon" />
              <p>Հարցեր չեն գտնվել</p>
            </div>
          ) : (
            <div className="questions-grid">
              {filtered.map((q, idx) => (
                <div
                  key={q._id}
                  className="question-card"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="card-main">
                    <div className="info">
                      <span className="q-number">#{idx + 1}</span>
                      <h3>{q.questionText}</h3>
                      {q.subQuestion && (
                        <textarea
                          className="description-textbox"
                          readOnly
                          value={q.subQuestion}
                          rows={3}
                          aria-label="Question description"
                        />
                      )}
                    </div>
                    <button
                      className="open-editor-btn"
                      onClick={() => setActiveEditor(String(q._id))}
                      aria-label={`Open editor for ${q.questionText}`}
                    >
                      <FaCode />
                      <span>Բացել</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* ══════════ EDITOR VIEW ══════════ */
        <div className="editor-page">
          <div className="editor-header">
            {/* Always-visible back button */}
            <button
              className="back-btn"
              onClick={() => setActiveEditor(null)}
              aria-label="Back to list"
            >
              <FaArrowLeft />
              <span>Հետ</span>
            </button>

            {activeQuestion && (
              <div className="editor-title">
                <span className="editor-title-text">
                  {activeQuestion.questionText}
                </span>
                <span className="lang-pill">
                  {formatLanguage(globalLanguage)}
                </span>
              </div>
            )}

            <div className="editor-actions">
              <button
                className="action-btn run-btn"
                onClick={() => handleRunCode(activeEditor)}
                disabled={isRunning[activeEditor]}
                aria-label="Run code"
              >
                {isRunning[activeEditor] ? <ButtonLoader /> : <FaPlay />}
                <span>Գործարկել</span>
              </button>

              <button
                className="action-btn download-btn"
                onClick={() =>
                  EditorController.downloadCode(
                    codeInputs[activeEditor],
                    globalLanguage,
                  )
                }
                aria-label="Download code"
              >
                <FaDownload />
                <span>Բեռնել</span>
              </button>

              <button
                className="action-btn submit-btn"
                onClick={() => handleSubmitCode(activeEditor)}
                disabled={uploading[activeEditor]}
                aria-label="Submit code"
              >
                {uploading[activeEditor] ? <ButtonLoader /> : <FaRocket />}
                <span>Ուղարկել</span>
              </button>
            </div>
          </div>

          <div className="monaco-wrapper">
            <Editor
              theme="vs-dark"
              language={getMonacoLang(globalLanguage)}
              value={codeInputs[activeEditor] ?? ""}
              onChange={(val) => handleCodeChange(val, activeEditor)}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                lineNumbers: "on",
                renderLineHighlight: "line",
                tabSize: 2,
              }}
            />
          </div>

          {outputs[activeEditor] && (
            <div className="terminal" role="region" aria-label="Code output">
              <div className="terminal-header">
                <FaTerminal />
                <span>Output</span>
                <button
                  className="terminal-clear"
                  onClick={() =>
                    setOutputs((p) => ({ ...p, [activeEditor]: "" }))
                  }
                  aria-label="Clear output"
                >
                  Մաքրել
                </button>
              </div>
              <pre className="terminal-body">{outputs[activeEditor]}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserQuestionsList;
