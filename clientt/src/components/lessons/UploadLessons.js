import React, { useState } from "react";
import { api } from "../../api/api";
import "../Programming/AdminResources.css";
import { LANGUAGES } from "../../constants/languages";

const INITIAL_FORM = {
  language: "",
  title: "",
  category: "books",
  type: "pdf",
  url: "", // Changed from link to url
};

const UploadLessons = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      if (!form.language) throw new Error("Ընտրեք լեզուն");

      if (form.type === "pdf" && !file) {
        throw new Error("Պահանջվում է PDF ֆայլ");
      }

      if (form.type === "link" && !form.link) {
        throw new Error("Պահանջվում է հղում");
      }

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (form.type === "pdf") formData.append("file", file);

      const res = await api.post("/lessons", formData);

      setMessage("✅ Ավելացվեց");
      setForm(INITIAL_FORM);
      setFile(null);
    } catch (err) {
      console.error(err);

      const msg =
        err.response?.data?.message || err.message || "Սխալ տեղի ունեցավ";

      setMessage("❌ " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1> Դասերի ավելացում</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Լեզու
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
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
        <label>
          Վերնագիր
          <input
            name="title"
            placeholder="Մուտքագրեք վերնագիրը"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Բաժին
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="books">Գրքեր / PDF</option>
            <option value="links">Հղումներ</option>
          </select>
        </label>

        <label>
          Տեսակ
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="pdf">PDF</option>
            <option value="link">Link</option>
          </select>
        </label>

        {form.type === "pdf" && (
          <label>
            Վերբեռնեք PDF
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </label>
        )}

        {form.type === "link" && (
          <label>
            Տեղադրիր հղումը
            <input
              type="url"
              name="url" // Changed from link to url
              placeholder="https://example.com"
              value={form.url} // Changed from link to url
              onChange={handleChange}
              required
            />
          </label>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Վերբեռնվում է..." : "Ավելացնել"}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default UploadLessons;
