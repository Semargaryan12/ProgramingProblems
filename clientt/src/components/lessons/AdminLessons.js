import React, { useEffect, useState } from "react";
import "./LessonsAdmin.css";
import { api } from "../../api/api";

const AdminLessons = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const fetchResources = async () => {
    setLoading(true);
    try {
      // 1. Start the API call
      const responsePromise = api.get("/lessons");

      // 2. Create a 1-second delay promise
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Wait for BOTH to finish
      const [response] = await Promise.all([responsePromise, delayPromise]);

      setResources(response.data);
    } catch (err) {
      setError("Չհաջողվեց բեռնել նյութերը");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  /* ================= HELPERS ================= */
  const groupedByLanguage = resources.reduce((acc, item) => {
    const lang = item.language || "Other";
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(item);
    return acc;
  }, {});

  const handleDelete = async (id) => {
    if (!window.confirm("Վստա՞հ եք, որ ցանկանում եք ջնջել նյութը")) return;
    try {
      await api.delete(`/lessons/${id}`);
      setResources((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Չհաջողվեց ջնջել");
    }
  };

  const handleUpdate = async (id) => {
    if (!newTitle.trim()) return alert("Վերնագիրը դատարկ չի կարող լինել");
    try {
      const { data } = await api.put(`/lessons/${id}`, { title: newTitle });
      setResources((prev) =>
        prev.map((item) => (item._id === id ? data : item)),
      );
      setEditingId(null);
      setNewTitle("");
    } catch (err) {
      alert("Չհաջողվեց թարմացնել");
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Մշակվում է...</p>
      </div>
    );
  }

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Նյութերի կառավարում</h1>
        <span className="count-tag">{resources.length} Նյութ</span>
      </header>

      {Object.keys(groupedByLanguage).length === 0 ? (
        <div className="empty-box">Ցուցակը դատարկ է</div>
      ) : (
        Object.entries(groupedByLanguage).map(([language, items]) => (
          <section key={language} className="lang-section">
            <h2 className="lang-title">{language}</h2>
            <div className="item-list">
              {items.map((item) => (
                <div key={item._id} className="item-card">
                  {editingId === item._id ? (
                    <div className="edit-form">
                      <input
                        className="edit-input"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        autoFocus
                      />
                      <div className="edit-btns">
                        <button
                          className="btn-save"
                          onClick={() => handleUpdate(item._id)}
                        >
                          Պահպանել
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setEditingId(null)}
                        >
                          Չեղարկել
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="view-row">
                      <div className="info">
                        <span className="cat-label">{item.category}</span>
                        <p className="title-text">{item.title}</p>
                      </div>
                      <div className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setEditingId(item._id);
                            setNewTitle(item.title);
                          }}
                        >
                          Խմբագրել
                        </button>
                        <button
                          className="btn-del"
                          onClick={() => handleDelete(item._id)}
                        >
                          Ջնջել
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default AdminLessons;
