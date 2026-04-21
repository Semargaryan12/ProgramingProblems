import React, { useState, useEffect } from "react";
import { api } from "../../api/api";

/* ── Initial state ───────────────────────────────────── */
const BLANK_FORM = {
  name: "",
  surname: "",
  username: "",
  email: "",      // shown as current email (read-only label when editing)
  newEmail: "",   // user types new email here
  newPassword: "",
  confirmPassword: "",
};

const CREATE_FORM = {
  name: "",
  surname: "",
  username: "",
  email: "",
  password: "",
};

/* ── Field component ─────────────────────────────────── */
const Field = ({ label, name, type = "text", value, onChange, placeholder, readOnly, error }) => (
  <div className="af-field">
    <label className="af-label" htmlFor={`af-${name}`}>{label}</label>
    <input
      id={`af-${name}`}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`af-input${error ? " af-input--error" : ""}${readOnly ? " af-input--readonly" : ""}`}
      autoComplete="off"
    />
    {error && <span className="af-field-error">{error}</span>}
  </div>
);

/* ── Main component ──────────────────────────────────── */
const AdminForm = ({ editingAccount, onSuccess, onCancel, showNotification }) => {
  const [step,    setStep]    = useState("form"); // form | verify | verify-email
  const [loading, setLoading] = useState(false);
  const [otp,     setOtp]     = useState("");
  const [otpError, setOtpError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  // Create mode uses separate simpler state
  const [createData, setCreateData] = useState(CREATE_FORM);
  // Edit mode
  const [editData,   setEditData]   = useState(BLANK_FORM);
  const [fieldErrors, setFieldErrors] = useState({});

  /* ── Sync when editing account changes ────────────── */
  useEffect(() => {
    if (editingAccount) {
      setEditData({
        name:            editingAccount.name     || "",
        surname:         editingAccount.surname  || "",
        username:        editingAccount.username || "",
        email:           editingAccount.email    || "",
        newEmail:        "",
        newPassword:     "",
        confirmPassword: "",
      });
      setStep("form");
      setFieldErrors({});
    } else {
      setCreateData(CREATE_FORM);
      setStep("form");
    }
    setOtp("");
    setOtpError("");
  }, [editingAccount]);

  /* ── Handlers ─────────────────────────────────────── */
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData((p) => ({ ...p, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: null }));
  };

  /* ── Validate edit form ───────────────────────────── */
  const validateEdit = () => {
    const errs = {};
    if (!editData.name.trim())     errs.name     = "Անունը պարտադիր է";
    if (!editData.surname.trim())  errs.surname  = "Ազգանունը պարտադիր է";
    if (!editData.username.trim()) errs.username = "Մուտքանունը պարտադիր է";

    if (editData.newPassword || editData.confirmPassword) {
      if (editData.newPassword.length < 6)
        errs.newPassword = "Գաղտնաբառը պետք է լինի առնվազն 6 նիշ";
      if (editData.newPassword !== editData.confirmPassword)
        errs.confirmPassword = "Գաղտնաբառերը չեն համընկնում";
    }

    if (editData.newEmail && !/\S+@\S+\.\S+/.test(editData.newEmail))
      errs.newEmail = "Մուտքագրեք վավեր էլ. հասցե";

    return errs;
  };

  /* ── STEP 1a: Create admin ────────────────────────── */
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/super/register-admin", createData);
      showNotification("success", "Կոդը ուղարկվեց էլ․ հասցեին:");
      setStep("verify");
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Գործողությունը ձախողվեց:");
    } finally {
      setLoading(false);
    }
  };

  /* ── STEP 1b: Update account ──────────────────────── */
  const handleUpdate = async (e) => {
    e.preventDefault();
    const errs = validateEdit();
    if (Object.keys(errs).length > 0) return setFieldErrors(errs);

    setLoading(true);
    try {
      const route = editingAccount.role === "admin"
        ? `/super/admin/${editingAccount._id}`
        : `/super/user/${editingAccount._id}`;

      const payload = {
        name:     editData.name,
        surname:  editData.surname,
        username: editData.username,
      };

      if (editData.newPassword)  payload.newPassword = editData.newPassword;
      if (editData.newEmail)     payload.newEmail    = editData.newEmail;

      const res = await api.put(route, payload);

      if (res.data?.requiresEmailVerification) {
        // Backend sent OTP to new email — show OTP step
        setPendingEmail(res.data.pendingEmail);
        showNotification("success", res.data.message);
        setStep("verify-email");
      } else {
        showNotification("success", "Տվյալները թարմացվեցին:");
        onSuccess();
        if (onCancel) onCancel();
      }
    } catch (err) {
      showNotification("error", err.response?.data?.message || "Գործողությունը ձախողվեց:");
    } finally {
      setLoading(false);
    }
  };

  /* ── STEP 2: Verify new admin email (create flow) ─── */
  const handleVerifyCreate = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return setOtpError("Կոդը պարտադիր է");
    setLoading(true);
    try {
      await api.post("auth/verify-email", { email: createData.email, code: otp });
      showNotification("success", "Ադմինը հաջողությամբ հաստատվեց:");
      setCreateData(CREATE_FORM);
      setOtp("");
      setStep("form");
      onSuccess();
    } catch (err) {
      setOtpError(err.response?.data?.error || "Սխալ կոդ:");
    } finally {
      setLoading(false);
    }
  };

  /* ── STEP 2: Verify new email (edit flow) ────────── */
  const handleVerifyEmailChange = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return setOtpError("Կոդը պարտադիր է");
    setLoading(true);
    try {
      const route = editingAccount.role === "admin"
        ? `/super/admin/${editingAccount._id}/confirm-email`
        : `/super/user/${editingAccount._id}/confirm-email`;

      await api.post(route, { code: otp });
      showNotification("success", "Էլ. հասցեն հաջողությամբ թարմացվեց:");
      setOtp("");
      setStep("form");
      onSuccess();
      if (onCancel) onCancel();
    } catch (err) {
      setOtpError(err.response?.data?.message || "Սխալ կոդ:");
    } finally {
      setLoading(false);
    }
  };

  /* ── Title helper ────────────────────────────────── */
  const getTitle = () => {
    if (step === "verify")       return "Հաստատել Էլ. Հասցեն";
    if (step === "verify-email") return "Հաստատել Նոր Էլ. Հասցեն";
    if (editingAccount)          return "Խմբագրել Հաշիվ";
    return "Ստեղծել Ադմին";
  };

  /* ══════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════ */

  /* ── OTP step (shared UI) ───────────────────────── */
  if (step === "verify" || step === "verify-email") {
    const isEmailChange = step === "verify-email";
    return (
      <section className="af-card">
        <div className="af-card-header">
          <div className="af-card-icon af-card-icon--indigo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3>{getTitle()}</h3>
        </div>

        <div className="af-otp-info">
          <p>Հաստատման 6-նիշ կոդն ուղարկվեց՝</p>
          <strong>{isEmailChange ? pendingEmail : createData.email}</strong>
        </div>

        <form onSubmit={isEmailChange ? handleVerifyEmailChange : handleVerifyCreate} className="af-form">
          <div className="af-field">
            <label className="af-label" htmlFor="af-otp">Հաստատման կոդ</label>
            <input
              id="af-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="   ● ● ● ● ● ●"
              value={otp}
              onChange={(e) => { setOtp(e.target.value); setOtpError(""); }}
              className={`af-input af-input--otp${otpError ? " af-input--error" : ""}`}
              autoFocus
            />
            {otpError && <span className="af-field-error">{otpError}</span>}
          </div>

          <div className="af-btn-group">
            <button type="submit" className="af-btn af-btn--primary" disabled={loading}>
              {loading ? <span className="af-spinner" /> : "Հաստատել"}
            </button>
            <button
              type="button"
              className="af-btn af-btn--ghost"
              onClick={() => { setStep("form"); setOtp(""); setOtpError(""); }}
            >
              Վերադառնալ
            </button>
          </div>
        </form>
      </section>
    );
  }

  /* ── Edit form ───────────────────────────────────── */
  if (editingAccount) {
    return (
      <section className="af-card af-card--edit">
        <div className="af-card-header">
          <div className="af-card-icon af-card-icon--blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <h3>{getTitle()}</h3>
        </div>

        <form onSubmit={handleUpdate} className="af-form">

          {/* Current email — read only display */}
          <div className="af-field">
            <label className="af-label">Ընթացիկ Էլ. Հասցե</label>
            <div className="af-readonly-email">{editData.email}</div>
          </div>

          <div className="af-row">
            <Field label="Անուն"     name="name"     value={editData.name}     onChange={handleEditChange} error={fieldErrors.name}     placeholder="Անուն" />
            <Field label="Ազգանուն"  name="surname"  value={editData.surname}  onChange={handleEditChange} error={fieldErrors.surname}  placeholder="Ազգանուն" />
          </div>

          <Field label="Մուտքանուն" name="username" value={editData.username} onChange={handleEditChange} error={fieldErrors.username} placeholder="username" />

          {/* Divider */}
          <div className="af-section-label">Փոխել Էլ. Հասցեն (կամընտիր)</div>
          <Field
            label="Նոր Էլ. Հասցե"
            name="newEmail"
            type="email"
            value={editData.newEmail}
            onChange={handleEditChange}
            error={fieldErrors.newEmail}
            placeholder="new@example.com"
          />

          <div className="af-section-label">Փոխել Գաղտնաբառը (կամընտիր)</div>
          <div className="af-row">
            <Field
              label="Նոր Գաղտնաբառ"
              name="newPassword"
              type="password"
              value={editData.newPassword}
              onChange={handleEditChange}
              error={fieldErrors.newPassword}
              placeholder="••••••••"
            />
            <Field
              label="Հաստատել Գաղտնաբառը"
              name="confirmPassword"
              type="password"
              value={editData.confirmPassword}
              onChange={handleEditChange}
              error={fieldErrors.confirmPassword}
              placeholder="••••••••"
            />
          </div>

          <div className="af-btn-group">
            <button type="submit" className="af-btn af-btn--primary" disabled={loading}>
              {loading ? <span className="af-spinner" /> : "Պահպանել"}
            </button>
            <button type="button" className="af-btn af-btn--ghost" onClick={onCancel}>
              Չեղարկել
            </button>
          </div>
        </form>
      </section>
    );
  }

  /* ── Create form ─────────────────────────────────── */
  return (
    <section className="af-card">
      <div className="af-card-header">
        <div className="af-card-icon af-card-icon--green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
        <h3>Ստեղծել Ադմին</h3>
      </div>

      <form onSubmit={handleCreate} className="af-form">
        <div className="af-row">
          <div className="af-field">
            <label className="af-label" htmlFor="af-create-name">Անուն</label>
            <input id="af-create-name" name="name" className="af-input" placeholder="Անուն" value={createData.name} onChange={handleCreateChange} required />
          </div>
          <div className="af-field">
            <label className="af-label" htmlFor="af-create-surname">Ազգանուն</label>
            <input id="af-create-surname" name="surname" className="af-input" placeholder="Ազգանուն" value={createData.surname} onChange={handleCreateChange} required />
          </div>
        </div>

        <div className="af-field">
          <label className="af-label" htmlFor="af-create-username">Մուտքանուն</label>
          <input id="af-create-username" name="username" className="af-input" placeholder="username" value={createData.username} onChange={handleCreateChange} required />
        </div>
        <div className="af-field">
          <label className="af-label" htmlFor="af-create-email">Էլ. Հասցե</label>
          <input id="af-create-email" name="email" type="email" className="af-input" placeholder="admin@example.com" value={createData.email} onChange={handleCreateChange} required />
        </div>
        <div className="af-field">
          <label className="af-label" htmlFor="af-create-pw">Գաղտնաբառ</label>
          <input id="af-create-pw" name="password" type="password" className="af-input" placeholder="••••••••" value={createData.password} onChange={handleCreateChange} minLength={6} required />
        </div>

        <div className="af-btn-group">
          <button type="submit" className="af-btn af-btn--primary" disabled={loading}>
            {loading ? <span className="af-spinner" /> : "Ստեղծել"}
          </button>
          {createData.name && (
            <button type="button" className="af-btn af-btn--ghost" onClick={() => setCreateData(CREATE_FORM)}>
              Մաքրել
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default AdminForm;