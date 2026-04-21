import React, { useEffect, useState, useContext } from "react";
import axios from "axios"; 
import { LanguageContext } from "../../context/LanguageContext";
import "./lessonsList.css"; 

const API_URL = "http://localhost:5000";

/* ---------------- SPINNER COMPONENT ---------------- */
const Spinner = () => <div className="spinner"></div>;

/* ---------------- SECTION COMPONENT ---------------- */
const Section = ({ title, items, listClass }) => {
  const [loadingId, setLoadingId] = useState(null);

  const viewPdf = async (filePath, id) => {
    try {
      setLoadingId(id);
      
      // Fetch the PDF as a blob
      const response = await axios.get(`${API_URL}${filePath}`, {
        responseType: 'blob',
      });

      // Create a Blob from the response data specifically as a PDF
      const file = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a temporary URL for the blob
      const fileURL = URL.createObjectURL(file);
      
      // Open the URL in a new browser tab
      window.open(fileURL, '_blank');

      // Revoke the object URL after a short delay to free up memory
      // without breaking the new tab's access to the file
      setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
      
    } catch (err) {
      console.error("Error opening PDF:", err);
      alert("Չհաջողվեց բացել PDF-ը");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className={`section ${listClass}`}>
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p className="empty-text">Այս բաժնում դեռ նյութեր չկան:</p>
      ) : (
        <ul className="resource-list">
          {items.map((item) => (
            <li key={item._id} className="resource-item">
              {item.type === "pdf" ? (
                <button
                  className="pdf-btn"
                  disabled={loadingId === item._id}
                  onClick={() => viewPdf(item.filePath, item._id)}
                >
                  {loadingId === item._id ? (
                    <span className="button-loader"></span>
                  ) : (
                    "👁️" 
                  )}{" "}
                  {item.title} (PDF)
                </button>
              ) : (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="link">
                  🔗 {item.title}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
const LessonsList = () => {
  const { lang: currentLang } = useContext(LanguageContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Create the 1-second timer promise
      const timer = new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. Start the API call (using axios as you have it)
      const fetchPromise = axios.get(`${API_URL}/api/lessons`, {
        params: { language: currentLang }
      });

      // 3. Wait for both to complete
      const [res] = await Promise.all([fetchPromise, timer]);

      setResources(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Չհաջողվեց բեռնել նյութերը");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentLang) {
      setResources([]);
      setLoading(false);
      return;
    }
    fetchResources();
  }, [currentLang]);

  if (!currentLang) {
    return (
      <div className="problems-page">
        <div className="info-msg">Խնդրում ենք ընտրել լեզուն վերևի մենյուից:</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loader-container">
        <Spinner />
        <p>Բեռնվում է...</p>
      </div>
    );
  }

  if (error) return <div className="error">{error}</div>;

  const filterByCategory = (cat) => resources.filter((item) => item.category === cat);
  
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
    <div className="problems-page">
      <header className="header">
        <h1>{formatLanguage(currentLang)} դասընթացի նյութեր</h1>
      </header>
      <main className="content">
        <Section title="📚 Գրքեր և Ձեռնարկներ" items={filterByCategory("books")} listClass="books" />
        <Section title="🌐 Օգտակար Հղումներ" items={filterByCategory("links")} listClass="links" />
        {/* <Section title="📰 Հոդվածներ" items={filterByCategory("articles")} listClass="articles" /> */}
      </main>
    </div>
  );
};

export default LessonsList;