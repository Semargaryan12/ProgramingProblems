import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import "./AdminResources.css";

const AdminResourceList = () => {
  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchResources = async () => {
    try {
      // No language param sent, fetching the full list
      const res = await api.get("http://localhost:5000/api/resources");
      setResources(res.data);
    } catch (err) {
      setMessage("❌ Չհաջողվեց ստանալ տվյալները");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  /* ================= GROUPING LOGIC ================= */
  const groupedResources = resources.reduce((acc, item) => {
    const lang = item.language || "Այլ";
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(item);
    return acc;
  }, {});

  /* ================= HANDLERS ================= */
  const startEdit = (item) => {
    setEditingId(item._id);
    setEditTitle(item.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`http://localhost:5000/api/resources/${id}`, {
        title: editTitle,
      });
      setMessage("✅ Թարմացվեց");
      setEditingId(null);
      fetchResources();
    } catch {
      setMessage("❌ Չհաջողվեց թարմացնել");
    }
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Վստահ ե՞ս որ ուզում ես ջնջել")) return;
    try {
      await api.delete(`http://localhost:5000/api/resources/${id}`);
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setMessage("❌ Չհաջողվեց ջնջել");
    }
  };

  if (loading) return <p className="loading-text">Բեռնվում է...</p>;

  return (
    <div className="admin-list-container">
      <h2>📚 Ռեսուրսների կառավարում</h2>
      {message && <p className="form-message">{message}</p>}

      {Object.entries(groupedResources).map(([language, items]) => (
        <div key={language} className="language-group">
          <h3 className="group-title">📂 {language.toUpperCase()}</h3>
          <ul className="admin-grid">
            {items.map((item) => (
              <li key={item._id} className="admin-card">
                {editingId === item._id ? (
                  <div className="edit-box">
                    <input
                      className="edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <div className="actions">
                      <button className="save-btn" onClick={() => saveEdit(item._id)}>💾</button>
                      <button className="cancel-btn" onClick={cancelEdit}>✖</button>
                    </div>
                  </div>
                ) : (
                  <div className="view-box">
                    <h4>{item.title}</h4>
                    <p className="meta">
                      <span className={`type-badge ${item.type}`}>
                        {item.type === "pdf" ? "📄 PDF" : "🔗 Link"}
                      </span> 
                      • {item.category}
                    </p>

                    <div className="resource-link-box">
                      {item.type === "pdf" ? (
                        <a href={`http://localhost:5000${item.filePath}`} download>
                          Ներբեռնել PDF
                        </a>
                      ) : (
                        <a href={item.url} target="_blank" rel="noreferrer">
                          Բացել հղումը
                        </a>
                      )}
                    </div>

                    <div className="actions">
                      <button className="edit-btn" onClick={() => startEdit(item)}>✏️</button>
                      <button className="delete-btn" onClick={() => deleteResource(item._id)}>🗑</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminResourceList;