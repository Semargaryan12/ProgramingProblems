import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerService } from "../../components/AuthService/authService";
import "../../styles/loginRegister.css";

const CodeLabsLogo = () => (
  <svg className="auth-logo-svg" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z" fill="url(#auth-grad2)" opacity="0.15"/>
    <path d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z" stroke="url(#auth-grad2)" strokeWidth="1.5"/>
    <path d="M13 15L8 19L13 23"  stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25 15L30 19L25 23" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 13L17 25" stroke="#3fb950" strokeWidth="2" strokeLinecap="round"/>
    <defs>
      <linearGradient id="auth-grad2" x1="3.5" y1="2" x2="34.5" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#58a6ff"/>
        <stop offset="1" stopColor="#3fb950"/>
      </linearGradient>
    </defs>
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", surname: "", username: "", email: "", password: "",
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) errs[key] = "Դաշտը պարտադիր է";
    });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) return setErrors(formErrors);

    setLoading(true);
    try {
      await registerService(formData);
      navigate("/verify", { state: { email: formData.email } });
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-grid"  aria-hidden="true" />
      <div className="auth-bg-glow"  aria-hidden="true" />

      <div className="auth-panel auth-panel--wide">
        {/* Brand */}
        <div className="auth-brand">
          <CodeLabsLogo />
          <span className="auth-brand-text">
            Code<span className="auth-brand-accent">Labs</span>
          </span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Ստեղծիր հաշիվ</h1>
          <p className="auth-sub">Միացիր CodeLabs-ի հարթակին</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          {/* Name + Surname row */}
          <div className="auth-row">
            <div className="auth-field">
              <label htmlFor="reg-name" className="auth-label">Անուն</label>
              <div className={`auth-input-wrap${errors.name ? " auth-input-wrap--error" : ""}`}>
                <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input id="reg-name" name="name" placeholder="    Անուն" onChange={handleChange} autoComplete="given-name"/>
              </div>
              {errors.name && <span className="auth-error">{errors.name}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="reg-surname" className="auth-label">Ազգանուն</label>
              <div className={`auth-input-wrap${errors.surname ? " auth-input-wrap--error" : ""}`}>
                <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input id="reg-surname" name="surname" placeholder="    Ազգանուն" onChange={handleChange} autoComplete="family-name"/>
              </div>
              {errors.surname && <span className="auth-error">{errors.surname}</span>}
            </div>
          </div>

          {/* Username */}
          <div className="auth-field">
            <label htmlFor="reg-username" className="auth-label">Մուտքանուն</label>
            <div className={`auth-input-wrap${errors.username ? " auth-input-wrap--error" : ""}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <input id="reg-username" name="username" placeholder="    Մուտքանուն" onChange={handleChange} autoComplete="username"/>
            </div>
            {errors.username && <span className="auth-error">{errors.username}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">Էլ․ հասցե</label>
            <div className={`auth-input-wrap${errors.email ? " auth-input-wrap--error" : ""}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input id="reg-email" name="email" placeholder="      user@example.com" onChange={handleChange} autoComplete="email"/>
            </div>
            {errors.email && <span className="auth-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-label">Գաղտնաբառ</label>
            <div className={`auth-input-wrap${errors.password ? " auth-input-wrap--error" : ""}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input id="reg-password" name="password" type="password" placeholder="     ••••••••" onChange={handleChange} autoComplete="new-password"/>
            </div>
            {errors.password && <span className="auth-error">{errors.password}</span>}
          </div>

          {errors.server && (
            <div className="auth-server-error" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {errors.server}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Գրանցվել"}
          </button>
        </form>

        <p className="auth-switch">
          Արդեն ունե՞ս էջ։ <Link to="/login">Մուտք</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;