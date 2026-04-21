import React, { useState } from "react";
import axios from "axios";
import "./AdminResources.css";
import { LANGUAGES } from "../../constants/languages";
const INITIAL_FORM = {
  language: "",
  title: "",
  category: "books",
  type: "pdf",
  link: "",
};

const AdminResources = () => {
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
    setLoading(true);
    setMessage("");

    try {
      // Ստուգումներ
      if (form.type === "pdf" && !file) {
        throw new Error("Պահանջվում է PDF ֆայլ");
      }
      if (form.type === "link" && !form.link) {
        throw new Error("Պահանջվում է հղում");
      }

      // FormData պատրաստում
      const formData = new FormData();
      formData.append("language", form.language);
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("type", form.type);

     if (form.type === "pdf") {
  formData.append("file", file);
} else if (form.type === "link") {
  formData.append("url", form.link);
}


      // Axios request
      const response = await axios.post(
        "http://localhost:5000/api/resources",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 10000, // 10 վայրկյան
        }
      );

      // Եթե սերվերը վերադարձնում է error
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Սերվերը վերադարձրեց սխալ կոդ");
      }

      // Սկսված է success
      setMessage("✅ Նյութը հաջողությամբ ավելացվեց");
      setForm(INITIAL_FORM);
      setFile(null);
    } catch (err) {
      // Error handling
      console.log(err);
      
      let errorMessage = "Անհայտ սխալ տեղի ունեցավ";

      if (axios.isAxiosError(err)) {
        // Axios error
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        // JS error
        errorMessage = err.message;
      }

      setMessage("❌ Սխալ: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>Ադմին — Նյութերի ավելացում</h1>

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
            <option value="articles">Հոդվածներ</option>
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
              name="link"
              placeholder="https://example.com"
              value={form.link}
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

export default AdminResources;
