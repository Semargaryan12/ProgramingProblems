import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginService } from "../../components/AuthService/authService";
import "../../styles/loginRegister.css";

/* ── Same CodeLabs logo used site-wide ─────────────── */
const CodeLabsLogo = () => (
  <svg className="auth-logo-svg" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z" fill="url(#auth-grad)" opacity="0.15"/>
    <path d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z" stroke="url(#auth-grad)" strokeWidth="1.5"/>
    <path d="M13 15L8 19L13 23"  stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25 15L30 19L25 23" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 13L17 25" stroke="#3fb950" strokeWidth="2" strokeLinecap="round"/>
    <defs>
      <linearGradient id="auth-grad" x1="3.5" y1="2" x2="34.5" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#58a6ff"/>
        <stop offset="1" stopColor="#3fb950"/>
      </linearGradient>
    </defs>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.server) setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.identifier) errs.email    = "Էլ․ հասցեն կամ մուտքանունը պարտադիր է";
    if (!formData.password)   errs.password = "Գաղտնաբառը պարտադիր է";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) return setErrors(formErrors);

    setLoading(true);
    try {
      const { user } = await loginService(formData.identifier, formData.password);
      const routes = { superadmin: "/superadmin", admin: "/admin" };
      navigate(routes[user?.role] || "/user");
    } catch (err) {
      const msg = err.message;
      if      (msg.includes("հասցեով"))  setErrors({ email: msg });
      else if (msg.includes("Գաղտնաբառը")) setErrors({ password: msg });
      else if (msg.includes("հաստատել"))  setErrors({ server: msg, needsVerify: true });
      else                                setErrors({ server: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background layers */}
      <div className="auth-bg-grid"   aria-hidden="true" />
      <div className="auth-bg-glow"   aria-hidden="true" />

      <div className="auth-panel">
        {/* Brand */}
        <div className="auth-brand">
          <CodeLabsLogo />
          <span className="auth-brand-text">
            Code<span className="auth-brand-accent">Labs</span>
          </span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Բարի գալուստ</h1>
          <p className="auth-sub">Մուտք գործիր քո հաշիվ</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          {/* Identifier */}
          <div className="auth-field">
            <label htmlFor="login-identifier" className="auth-label">
              Էլ․ հասցե կամ մուտքանուն
            </label>
            <div className={`auth-input-wrap${errors.email ? " auth-input-wrap--error" : ""}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                id="login-identifier"
                name="identifier"
                placeholder="    user@example.com"
                value={formData.identifier}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            {errors.email && <span className="auth-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">
              Գաղտնաբառ
            </label>
            <div className={`auth-input-wrap${errors.password ? " auth-input-wrap--error" : ""}`}>
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="    ••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            {errors.password && <span className="auth-error">{errors.password}</span>}
          </div>

          {/* Server error */}
          {errors.server && (
            <div className="auth-server-error" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {errors.server}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Մուտք"}
          </button>
        </form>

        <p className="auth-switch">
          Չունե՞ս էջ։ <Link to="/register">Գրանցվել</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;