import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link as Linko, scroller } from "react-scroll";
import { LanguageContext } from "../../context/LanguageContext";
import "./AdminNavbar.css";

/* ── CodeLabs SVG Logo ─────────────────────────────── */
const CodeLabsLogo = () => (
  <svg
    className="cl-logo-svg"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="CodeLabs"
  >
    <path d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z" fill="url(#cl-grad)" opacity="0.15" />
    <path d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z" stroke="url(#cl-grad)" strokeWidth="1.5" />
    <path d="M13 15L8 19L13 23"  stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 15L30 19L25 23" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 13L17 25" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="cl-grad" x1="3.5" y1="2" x2="34.5" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#58a6ff" />
        <stop offset="1" stopColor="#3fb950" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Dropdown component ─────────────────────────────── */
const Dropdown = ({ label, items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <li
      className={`cl-dropdown${open ? " open" : ""}`}
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="cl-dropdown-toggle" aria-expanded={open}>
        {label}
        <span className="cl-chevron">{open ? "▴" : "▾"}</span>
      </button>
      <ul className="cl-dropdown-menu" role="menu">
        {items.map(({ to, label: itemLabel }) => (
          <li key={to} role="none">
            <Link to={to} role="menuitem" onClick={() => setOpen(false)}>
              {itemLabel}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

/* ── Helpers ────────────────────────────────────────── */
const LANG_MAP = { cpp: "C++", javascript: "JavaScript", python: "Python", java: "Java" };
const formatLanguage = (lang) => LANG_MAP[lang?.toLowerCase()] || lang;

/* ── Role → home route map ──────────────────────────── */
const HOME_ROUTE = {
  user:       "/user",
  admin:      "/admin",
  superadmin: "/superadmin",
};

/* ── Main component ─────────────────────────────────── */
const AdminNavbar = ({ toggleFooter }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { lang: selectedLanguage, changeLang, resetLang } = useContext(LanguageContext);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();
  const role = user?.role;

  /* ── Logo destination based on role ───────────────── */
  const logoHref = HOME_ROUTE[role] || "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const selectLang = (lang) => {
    changeLang(lang);
    if (location.pathname !== "/lessons") navigate("/lessons");
    setMobileOpen(false);
  };

  const handleResetLang = () => {
    resetLang();
    navigate("/user");
  };

  const handleScrollToFooter = () => {
    scroller.scrollTo("contacts-section", { smooth: true, duration: 500 });
    if (typeof toggleFooter === "function") toggleFooter();
  };

  const isActive = (path) => location.pathname === path;

  const adminViewItems = [
    { to: "/questions/list",      label: "Առաջադրանքներ" },
    { to: "/admin/lessons/list",  label: "Դասեր" },
    { to: "/admin/quizzes/list",  label: "Թեստեր" },
    { to: "/admin/labs/list",     label: "Գործնականներ" },
    { to: "/admin/resource/list", label: "Ռեսուրսներ" },
    { to: "/admin/video/list",    label: "Տեսադասեր" },
  ];

  const adminCreateItems = [
    { to: "/admin/lessons/upload",   label: "Ստեղծել դաս" },
    { to: "/admin/quizzes/create",   label: "Ստեղծել թեստ" },
    { to: "/admin/resource/create",  label: "Ստեղծել այլ" },
    { to: "/admin/questions/create", label: "Ստեղծել առաջադրանք" },
    { to: "/admin/labs/create",      label: "Ստեղծել գործնական" },
    { to: "/admin/video/create",     label: "Ներբեռնել վիդեո" },
  ];

  return (
    <nav className={`cl-navbar${scrolled ? " cl-navbar--scrolled" : ""}${mobileOpen ? " cl-navbar--mobile-open" : ""}`}>

      {/* ── Logo — redirects to role-based home ──────── */}
      <Link to={logoHref} className="cl-logo" aria-label="CodeLabs home">
        <CodeLabsLogo />
        <span className="cl-logo-text">
          Code<span className="cl-logo-accent">Labs</span>
        </span>
      </Link>

      {/* ── Desktop nav ──────────────────────────────── */}
      <div className="cl-nav-center">
        <ul className="cl-nav-list">

          {/* ADMIN */}
          {role === "admin" && (
            <>
              <Dropdown label="Տեսնել"  items={adminViewItems}  />
              <Dropdown label="Ստեղծել" items={adminCreateItems} />
              <li className={isActive("/admin/users/list") ? "cl-active" : ""}>
                <Link to="/admin/users/list">Ուսանող</Link>
              </li>
            </>
          )}

          {/* USER — no language selected */}
          {role === "user" && !selectedLanguage && (
            <>
              {["cpp", "python", "javascript"].map((lang) => (
                <li key={lang} className="cl-lang-option" onClick={() => selectLang(lang)}>
                  {formatLanguage(lang)}
                </li>
              ))}
            </>
          )}

          {/* USER — language selected */}
          {role === "user" && selectedLanguage && (
            <>
              <li>
                <button className="cl-home-btn" onClick={handleResetLang} title="Վերադառնալ">
                  <FontAwesomeIcon icon={faHouseChimney} />
                </button>
              </li>
              <li>
                <span className="cl-lang-badge">{formatLanguage(selectedLanguage)}</span>
              </li>
              {[
                { to: "/lessons",        label: "Դասեր" },
                { to: "/videos",         label: "Տեսադասեր" },
                { to: "/questions/list", label: "Առաջադրանքներ" },
                { to: "/quizzes/list",   label: "Թեստեր" },
                { to: "/statisticfunc",  label: "Հավելյալ նյութեր" },
              ].map(({ to, label }) => (
                <li key={to} className={isActive(to) ? "cl-active" : ""}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
              <li>
                <Linko
                  to="contacts-section"
                  smooth={true}
                  duration={500}
                  className="cl-scroll-link"
                  onClick={handleScrollToFooter}
                >
                  Կոնտակտ
                </Linko>
              </li>
            </>
          )}

          {/* SUPERADMIN */}
          {role === "superadmin" && (
            <li className={isActive("/superadmin") ? "cl-active" : ""}>
              <Link to="/superadmin">Կառավարման վահանակ</Link>
            </li>
          )}

        </ul>
      </div>

      {/* ── Right side ───────────────────────────────── */}
      <div className="cl-nav-right">
        {role && (
          <button className="cl-logout-btn" onClick={handleLogout} aria-label="Logout">
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Ելք</span>
          </button>
        )}
        <button
          className={`cl-hamburger${mobileOpen ? " active" : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span /><span /><span />
        </button>
      </div>

    </nav>
  );
};

export default AdminNavbar;