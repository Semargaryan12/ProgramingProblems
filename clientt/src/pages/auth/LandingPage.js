import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./landingPage.css";

/* ── Same CodeLabs logo used across the app ─────────── */
const CodeLabsLogo = () => (
  <svg
    className="lp-logo-svg"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z" fill="url(#lp-grad)" opacity="0.15" />
    <path d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z" stroke="url(#lp-grad)" strokeWidth="1.5" />
    <path d="M13 15L8 19L13 23"  stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 15L30 19L25 23" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 13L17 25" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="lp-grad" x1="3.5" y1="2" x2="34.5" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#58a6ff" />
        <stop offset="1" stopColor="#3fb950" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Feature cards data ──────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    title: "Տեսական դասեր",
    desc: "Մանրամասն մշակված դասեր՝ գրված պարզ և հասկանալի հայերենով",
    accent: "blue",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    title: "Տեսադասեր",
    desc: "Պրակտիկ օրինակներով հագեցած տեսանյութեր ցանկացած ժամանակ",
    accent: "green",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: "Առաջադրանքներ",
    desc: "Ամրապնդիր գիտելիքներդ գործնական խնդիրների միջոցով",
    accent: "orange",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: "Թեստեր",
    desc: "Ստուգիր առաջադիմությունդ ինտերակտիվ թեստերի օգնությամբ",
    accent: "purple",
  },
];

/* ── Animated code snippet for hero ─────────────────── */
const CODE_LINES = [
  { text: 'int main() {',         indent: 0, color: "blue"   },
  { text: '  string name = "Arm";', indent: 1, color: "green" },
  { text: '  cout << "Բարև " << name;', indent: 1, color: "default" },
  { text: '  return 0;',          indent: 1, color: "orange" },
  { text: '}',                    indent: 0, color: "blue"   },
];

/* ── Main component ──────────────────────────────────── */
const LandingPage = () => {
  const navigate  = useNavigate();
  const heroRef   = useRef(null);

  /* Parallax on scroll */
  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.18}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp-root">

      {/* ── Background layers ─────────────────────────── */}
      <div className="lp-bg-grid" aria-hidden="true" />
      <div className="lp-bg-glow lp-bg-glow--1" aria-hidden="true" />
      <div className="lp-bg-glow lp-bg-glow--2" aria-hidden="true" />

      {/* ══════════ NAVBAR ══════════ */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-brand">
            <CodeLabsLogo />
            <span className="lp-brand-text">
              Code<span className="lp-brand-accent">Labs</span>
            </span>
          </div>

          <nav className="lp-nav-links" aria-label="Main navigation">
            <button className="lp-btn lp-btn--ghost" onClick={() => navigate("/login")}>
              Մուտք
            </button>
            <button className="lp-btn lp-btn--primary" onClick={() => navigate("/register")}>
              Գրանցվել
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* ══════════ HERO ══════════ */}
      <section className="lp-hero" aria-labelledby="hero-heading">
        <div className="lp-hero-inner">

          {/* Left — text */}
          <div className="lp-hero-text">
            <div className="lp-eyebrow">
              <span className="lp-eyebrow-dot" />
              Ծրագրավորման հարթակ հայերեն
            </div>

            <h1 id="hero-heading" className="lp-hero-title">
              Սովորիր<br />
              ծրագրավորում<br />
              <span className="lp-title-accent">հայերենով</span>
            </h1>

            <p className="lp-hero-sub">
              Բացահայտիր <strong>C++, Python</strong> և <strong>JavaScript</strong> լեզուների
              աշխարհը մեր համապարփակ հարթակում։ Սկսնակից մինչև պրոֆեսիոնալ։
            </p>

            {/* <div className="lp-hero-cta">
              <button className="lp-btn lp-btn--primary lp-btn--lg" onClick={() => navigate("/register")}>
                Սկսել անվճար
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
              <button className="lp-btn lp-btn--ghost lp-btn--lg" onClick={() => navigate("/login")}>
                Արդեն ունե՞ս հաշիվ
              </button>
            </div> */}

            {/* Language chips */}
            <div className="lp-lang-chips">
              <span className="lp-lang-chip lp-lang-chip--cpp">C++</span>
              <span className="lp-lang-chip lp-lang-chip--python">Python</span>
              <span className="lp-lang-chip lp-lang-chip--js">JavaScript</span>
            </div>
          </div>

          {/* Right — code window */}
          <div className="lp-hero-code" ref={heroRef} aria-hidden="true">
            <div className="lp-code-window">
              <div className="lp-code-titlebar">
                <span className="lp-dot lp-dot--red"   />
                <span className="lp-dot lp-dot--yellow" />
                <span className="lp-dot lp-dot--green"  />
                <span className="lp-code-filename">main.cpp</span>
              </div>
              <div className="lp-code-body">
                <div className="lp-code-lines">
                  {CODE_LINES.map((line, i) => (
                    <div
                      key={i}
                      className={`lp-code-line lp-code-line--${line.color}`}
                      style={{ animationDelay: `${i * 0.18 + 0.4}s` }}
                    >
                      <span className="lp-line-num">{i + 1}</span>
                      <span className="lp-line-text">{line.text}</span>
                    </div>
                  ))}
                  {/* Blinking cursor */}
                  <div className="lp-cursor" style={{ animationDelay: "1.4s" }}>
                    <span className="lp-line-num">6</span>
                    <span className="lp-cursor-bar" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="lp-float-badge lp-float-badge--1">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Կոդի գործարկում
            </div>
            <div className="lp-float-badge lp-float-badge--2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
               Առաջադրանքներ
            </div>
          </div>

        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="lp-features" aria-labelledby="features-heading">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <h2 id="features-heading" className="lp-section-title">
              Ամեն ինչ <span className="lp-title-accent">մեկ տեղում</span>
            </h2>
            <p className="lp-section-sub">
              Բոլոր ռեսուրսները, որոնք անհրաժեշտ են ծրագրավորում սովորելու համար
            </p>
          </div>

          <div className="lp-feature-grid">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`lp-feature-card lp-feature-card--${f.accent}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`lp-feature-icon lp-feature-icon--${f.accent}`}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="lp-feature-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ LANGUAGES ══════════ */}
      <section className="lp-langs" aria-labelledby="langs-heading">
        <div className="lp-section-inner">
          <h2 id="langs-heading" className="lp-section-title">
            Ինչ <span className="lp-title-accent">լեզուներ</span> ենք սովորում
          </h2>

          <div className="lp-lang-cards">
            {[
              { name: "C++", tag: "cpp",    desc: "Համակարգային ծրագրավորում", level: "Հիմնական" },
              { name: "Python", tag: "python", desc: "Արհեստական բանականություն", level: "Հայտնի" },
              { name: "JavaScript", tag: "js", desc: "Վեբ ծրագրավորում", level: "Պահանջված" },
            ].map((lang) => (
              <div key={lang.tag} className={`lp-lang-card lp-lang-card--${lang.tag}`}>
                <div className="lp-lang-card-top">
                  <span className={`lp-lang-name lp-lang-name--${lang.tag}`}>{lang.name}</span>
                  <span className="lp-lang-level">{lang.level}</span>
                </div>
                <p className="lp-lang-desc">{lang.desc}</p>
                <div className="lp-lang-bar">
                  <div className={`lp-lang-bar-fill lp-lang-bar-fill--${lang.tag}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      {/* <section className="lp-cta">
        <div className="lp-cta-inner">
          <h2 className="lp-cta-title">Պատրա՞ստ ես սկսել</h2>
          <p className="lp-cta-sub">Գրանցվիր անվճար և սկսիր սովորել այսօր</p>
          <button className="lp-btn lp-btn--primary lp-btn--lg" onClick={() => navigate("/register")}>
            Անվճար գրանցվել
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </section> */}

      {/* ══════════ FOOTER ══════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-brand lp-brand--sm">
            <CodeLabsLogo />
            <span className="lp-brand-text">
              Code<span className="lp-brand-accent">Labs</span>
            </span>
          </div>
          <p className="lp-footer-copy">
            &copy; {new Date().getFullYear()} CodeLabs. Բոլոր իրավունքները պաշտպանված են։
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;