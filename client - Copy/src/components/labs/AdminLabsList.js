import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import "./styles/AdminLabsList.css";
const AdminLabsList = () => {
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [editingLab, setEditingLab] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/unauthorized");
    } else {
      fetchLabs();
    }
  }, [isAdmin, navigate]);

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/labs");
      setLabs(data);
      setFilteredLabs(data);
    } catch (error) {
      console.error("Խնդիր բեռնելիս:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Իսկապե՞ս ուզում եք ջնջել:"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/labs/${id}`);
      fetchLabs();
    } catch (error) {
      console.error("Խնդիր  հեռացնելիս:", error);
    }
  };

  const handleEditInit = (lab) => {
    setEditingLab(lab._id);
    setFormData({ title: lab.title, content: lab.content });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { title, content } = formData;

    if (!title.trim() || !content.trim()) {
      alert("Խնդրում ենք լրացնել և՛ վերնագիրը, և՛ բովանդակությունը։");
      return;
    }

    try {
      await api.put(`/labs/${editingLab}`, formData);
      setEditingLab(null);
      fetchLabs();
    } catch (error) {
      console.error("Խնդիր  խմբագրելիս:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = labs.filter((lab) =>
      lab.title.toLowerCase().includes(value)
    );
    setFilteredLabs(filtered);
  };

  if (loading) {
    return (
      <div className="video-list-container spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-lab-container">
      <h2>Ստեղծված գործնականներ</h2>

      <input
        type="text"
        placeholder="Փնտրել վերնագրով"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      {filteredLabs.length === 0 ? (
        <p>Ոչ մի գործնական չի համապատասխանում ձեր որոնմանը։</p>
      ) : (
        filteredLabs.map((lab) => (
          <div key={lab._id} className="admin-lab-card">
            {editingLab === lab._id ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleEditChange}
                  required
                />
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleEditChange}
                  required
                />
                <button type="submit">Պահպանել</button>
                <button type="button" onClick={() => setEditingLab(null)}>
                  Չեղարկել
                </button>
              </form>
            ) : (
              <>
                <h3>{lab.title}</h3>
                <p>{lab.content}</p>
                <div className="lab-actions">
                  <button onClick={() => handleEditInit(lab)}>Խմբագրել</button>
                  <button onClick={() => handleDelete(lab._id)}>
                    Հեռացնել
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminLabsList;
