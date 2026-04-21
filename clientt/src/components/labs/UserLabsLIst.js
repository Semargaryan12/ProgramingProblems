import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaCloudUploadAlt,
  FaFileExcel,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import { api } from "../../api/api";
import "./styles/UserLabsList.css";

const UserLabsList = () => {
  const [labs, setLabs] = useState([]);
  const [fileInputs, setFileInputs] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStates, setUploadStates] = useState({});

  const navigate = useNavigate();
  const labRefs = useRef({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("accessToken");

    if (!token || user?.role !== "user") {
      navigate("/unauthorized");
      return;
    }

    const fetchLabs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/labs");
        setLabs(res.data);
      } catch (err) {
        setError(" Բեռնումը ձախողվեց։");
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, [navigate]);

  // Optimized Filtering
  const filteredLabs = useMemo(() => {
    const words = searchQuery.toLowerCase().split(" ").filter(Boolean);
    return labs.filter((lab) =>
      words.every((word) => lab.title.toLowerCase().includes(word)),
    );
  }, [labs, searchQuery]);

  const handleFileChange = (e, labId) => {
    const file = e.target.files[0];
    if (file) {
      setFileInputs((prev) => ({ ...prev, [labId]: file }));
      setUploadStates((prev) => ({ ...prev, [labId]: { status: "idle" } }));
    }
  };

  const handleSubmit = async (e, labId) => {
    e.preventDefault();
    const file = fileInputs[labId];

    if (!file) {
      setUploadStates((prev) => ({
        ...prev,
        [labId]: { status: "error", message: "Ընտրեք ֆայլը" },
      }));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("laboratorId", labId);

    setUploadStates((prev) => ({ ...prev, [labId]: { status: "uploading" } }));

    try {
      await api.post(`/labs/${labId}/answer`, formData);
      setUploadStates((prev) => ({ ...prev, [labId]: { status: "success" } }));
      setFileInputs((prev) => ({ ...prev, [labId]: null }));
    } catch (err) {
      const isAlreadySubmitted = err.response?.status === 400;
      setUploadStates((prev) => ({
        ...prev,
        [labId]: {
          status: "error",
          message: isAlreadySubmitted
            ? "Արդեն տեղադրված է"
            : "Սխալ վերբեռնման ժամանակ",
        },
      }));
    }
  };

  return (
    <div className="labs-page-wrapper">
      <div className="labs-container">
        <header className="labs-header">
          <h1>Գործնական աշխատանքներ</h1>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Փնտրել ըստ վերնագրի..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <FaSpinner className="spin-icon" />
            <p>Բեռնվում է...</p>
          </div>
        ) : error ? (
          <div className="error-card">
            <FaExclamationCircle /> {error}
          </div>
        ) : (
          <div className="labs-grid">
            {filteredLabs.length === 0 ? (
              <div className="empty-state">Արդյունքներ չեն գտնվել:</div>
            ) : (
              filteredLabs.map((lab) => (
                <div
                  key={lab._id}
                  className="lab-card"
                  ref={(el) => (labRefs.current[lab._id] = el)}
                >
                  <div className="lab-info">
                    <h3 className="lab-title">{lab.title}</h3>
                    <p className="lab-content">{lab.content}</p>
                  </div>

                  <form
                    className="lab-upload-form"
                    onSubmit={(e) => handleSubmit(e, lab._id)}
                  >
                    <label
                      className={`file-drop-zone ${fileInputs[lab._id] ? "file-selected" : ""}`}
                    >
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => handleFileChange(e, lab._id)}
                      />
                      <FaCloudUploadAlt className="upload-icon" />
                      <span>
                        {fileInputs[lab._id]
                          ? fileInputs[lab._id].name
                          : "Ընտրեք  ֆայլը"}
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="btn-upload"
                      disabled={
                        uploadStates[lab._id]?.status === "uploading" ||
                        uploadStates[lab._id]?.status === "success"
                      }
                    >
                      {uploadStates[lab._id]?.status === "uploading"
                        ? "Տեղադրվել է"
                        : "Տեղադրել պատասխանը"}
                    </button>
                  </form>

                  {uploadStates[lab._id]?.status === "success" && (
                    <div className="status-msg success">
                      <FaCheckCircle /> Հաջողությամբ ուղարկված է
                    </div>
                  )}
                  {uploadStates[lab._id]?.status === "error" && (
                    <div className="status-msg error">
                      <FaExclamationCircle /> {uploadStates[lab._id].message}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLabsList;
