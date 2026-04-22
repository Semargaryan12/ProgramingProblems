import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./ProgrammingProblems.css";
import { LanguageContext } from "../../context/LanguageContext"; 
const API_URL = "http://localhost:5000";

const ProgrammingProblems = () => {

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { lang: language } = useContext(LanguageContext);
useEffect(() => {
  const fetchResources = async () => {
    if (!language) return;
    
    setLoading(true);
    setError("");

    try {
      // Create a promise that resolves after 1 second
      const timer = new Promise((resolve) => setTimeout(resolve, 1000));

      // Start fetching data
      const fetchPromise = fetch(
        `${API_URL}/api/resources?language=${encodeURIComponent(language)}`
      );

      // Wait for BOTH the data and the 1-second timer to finish
      const [res] = await Promise.all([fetchPromise, timer]);

      if (!res.ok) throw new Error("Failed to load resources");
      
      const data = await res.json();
      setResources(data);
    } catch (err) {
      setError("Չհաջողվեց բեռնել նյութերը");
    } finally {
      setLoading(false);
    }
  };

  fetchResources();
}, [language]);

  const filterByCategory = (category) =>
    resources.filter((item) => item.category === category);

if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Բեռնում...</p>
      </div>
    );
  }

  if (error)
    return <div className="error">{error}</div>;

  return (
    <div className="problems-page">
      <header className="header">
     

        <h1>Ծրագրավորման խնդիրների վերլուծություն</h1>
        <p className="subtitle">
          Գրքեր, PDF-ներ և օգտակար հղումներ
        </p>
      </header>

      <main className="content">
      <Section
  title="📘 Գրքեր և PDF նյութեր"
  items={filterByCategory("books")}
  listClass="books" // Pass this down
/>

        <Section
          title="🌐 Առցանց ռեսուրսներ"
          items={filterByCategory("links")}
        />

        <Section
          title="📄 Հոդվածներ և ուսումնասիրություններ"
          items={filterByCategory("articles")}
        />
      </main>
    </div>
  );
};

export default ProgrammingProblems;

/* ---------------- SECTION COMPONENT ---------------- */

const Section = ({ title, items, listClass }) => {
  const downloadPdf = async (filePath, title) => {
    try {
      const res = await fetch(`http://localhost:5000${filePath}`);
      if (!res.ok) throw new Error("Download error");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      alert("Չհաջողվեց ներբեռնել PDF-ը");
    }
  };

  return (
    <section className={`section ${listClass}`}>
      <h2>{title}</h2>

      {items.length === 0 ? (
        <p className="empty-text">Առայժմ նյութ չկա</p>
      ) : (
        <ul className="resource-list">
          {items.map((item) => (
            <li key={item._id} className="resource-item">
              {item.type === "pdf" ? (
                <button
                  className="pdf-btn"
                  onClick={() =>
                    downloadPdf(item.filePath, item.title)
                  }
                >
                  📥 {item.title}
                </button>
              ) : (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
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
