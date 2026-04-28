import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./landingPage.css";

/* ── Logo ────────────────────────────────────────────── */
const CodeLabsLogo = () => (
  <svg className="lp-logo-svg" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z" fill="url(#lp-grad)" opacity="0.15" />
    <path d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z" stroke="url(#lp-grad)" strokeWidth="1.5" />
    <path d="M13 15L8 19L13 23"  stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 15L30 19L25 23" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 13L17 25" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="lp-grad" x1="3.5" y1="2" x2="34.5" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#58a6ff" /><stop offset="1" stopColor="#3fb950" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Icons ───────────────────────────────────────────── */
const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IconVideo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);
const IconCheck2 = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

/* ── Code lines ──────────────────────────────────────── */
const CODE_LINES = [
  { text: 'int main() {',               color: "blue"    },
  { text: '  string name = "Arm";',     color: "green"   },
  { text: '  cout << "Բարև " << name;', color: "default" },
  { text: '  return 0;',               color: "orange"  },
  { text: '}',                          color: "blue"    },
];

// /* ── How it works steps ──────────────────────────────── */
// const HOW_STEPS = [
//   { num: "01", icon: <IconBook />,   title: "Կարդա դասը",        desc: "Ամեն թեմա մանրամասն բացատրված է հայերենով՝ հստակ օրինակներով" },
//   { num: "02", icon: <IconVideo />,  title: "Դիտիր տեսադասը",    desc: "Եթե տեքստը բավական չէ — տեսանյութերը կooompleomplete-ացնեն հասկացողությունը" },
//   { num: "03", icon: <IconCode />,   title: "Լուծիր խնդիրը",     desc: "Գործնական առաջադրանքներ, որ ամրապնդում են ձեռք բերած գիտելիքները" },
//   { num: "04", icon: <IconCheck2 />, title: "Անցիր թեստը",       desc: "Ստուգիր քո պատրաստվածությունը հարցուների միջոցով" },
// ];

/* ── Features ────────────────────────────────────────── */
const FEATURES = [
  { icon: <IconBook />,   accent: "blue",   title: "Հայերեն դասեր",     desc: "Ծրագրավորման ամբողջ կուրսը գրված և բացատրված է հայ ուսանողի համար, հայ մտածողությամբ" },
  { icon: <IconVideo />,  accent: "green",  title: "Տեսադասեր",         desc: "Յուրաքանչյուր բարդ թեմայի համար կա տեսանյութ, որ ցույց է տալիս լուծման ամբողջ ընթացքը" },
  { icon: <IconCode />,   accent: "orange", title: "Գործնական խնդիրներ", desc: "Ոչ միայն տեսություն — ամեն դասից հետո լուծում ես իրական կոդ գրելու առաջադրանք" },
  { icon: <IconCheck2 />, accent: "purple", title: "Ինտերակտիվ թեստեր", desc: "Թեստերն ստուգում են ոչ միայն անգիր արածը, այլ հասկացողությունն ու տրամաբանությունը" },
  { icon: <IconTarget />, accent: "teal",   title: "Անհատական Պրոֆիլ",  desc: "Հետևիր քո առաջադիմությանը՝ տեսիր կատարած առաջադրանքները, թեստերի արդյունքները" },
  { icon: <IconLayers />, accent: "rose",   title: "Հետևողական կառուցվածք", desc: "Հիմունքներից մինչև advanced — ամեն փուլ կառուցված է նախորդի վրա, ոչ մի բաց չի թողնվի" },
];

/* ── Languages ───────────────────────────────────────── */
const LANGS = [
  {
    tag: "cpp", name: "C++", level: "Հիմնական",
    desc: "Ամենաուժեղ ու արագ լեզուն։ Սովորիր ծրագրավորման հիմքերը ճիշտ ձևով — pointer-ներ, հիշողության կառավարում, OOP։",
    points: ["Pointer-ներ & Reference-ներ", "OOP — Class, Inheritance", "STL — vector, map, set", "Ալգորիթմներ & Complexity"],
    bar: 90,
  },
  {
    tag: "python", name: "Python", level: "Հայտնի",
    desc: "Ամենաարագ սովորվող լեզուն։ Ֆայլեր, API-ներ, automation — Python-ով ամեն ինչ հեշտ է։",
    points: ["Syntax & Data Types", "Ֆունկցիաներ & OOP", "Ֆայլեր & JSON", "Ստանդարտ գրադարաններ"],
    bar: 80,
  },
  {
    tag: "js", name: "JavaScript", level: "Պահանջված",
    desc: "Վեբի լեզուն։ DOM, events, async — JavaScript-ը բոլոր բրաուզերներում կենդանի է։",
    points: ["DOM & Events", "ES6+ — Arrow fn, Destructuring", "Async/Await & Fetch", "Modules & Closures"],
    bar: 75,
  },
];

/* ── Who is it for ───────────────────────────────────── */
const FOR_WHOM = [
  { emoji: "🎓", title: "Ուսանողներ",      desc: "Ովքեր առաջին անգամ բախվում են ծրագրավորմանը" },
  { emoji: "🔄", title: "Փոխանցվողներ",    desc: "Ովքեr ուզում են անցնել IT ոլորտ" },
  { emoji: "📚", title: "Ինքնուս",          desc: "Ովքեr կուզեին հայերեն բացատրություններ" },
  { emoji: "🏫", title: "Դպրոցականներ",    desc: "Ովքեr նոր են ծանոթանում կոդ գրելուն" },
];

/* ── Main component ──────────────────────────────────── */
const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef  = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.14}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp-root">
      <div className="lp-bg-grid" aria-hidden="true" />
      <div className="lp-bg-glow lp-bg-glow--1" aria-hidden="true" />
      <div className="lp-bg-glow lp-bg-glow--2" aria-hidden="true" />

      {/* ══ NAVBAR ══ */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-brand">
            <CodeLabsLogo />
            <span className="lp-brand-text">Code<span className="lp-brand-accent">Labs</span></span>
          </div>
          <nav className="lp-nav-links">
            <button className="lp-btn lp-btn--ghost" onClick={() => navigate("/login")}>Մուտք</button>
            <button className="lp-btn lp-btn--primary" onClick={() => navigate("/register")}>
              Գրանցվել <IconArrow />
            </button>
          </nav>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <div className="lp-eyebrow">
              <span className="lp-eyebrow-dot" />
              Ծրագրավորման հարթակ հայերեն
            </div>
            <h1 className="lp-hero-title">
              Սովորիր<br />
              ծրագրավորում<br />
              <span className="lp-title-accent">հայերենով</span>
            </h1>
            <p className="lp-hero-sub">
              CodeLabs-ը հայկական ուսուցման հարթակ է, որտեղ <strong>C++, Python</strong> և <strong>JavaScript</strong> կսովորես հայ ուսուցիչների կողմից կազմված դասերով, տեսադասերով, գործնական առաջադրանքներով և թեստերով։
            </p>
            <div className="lp-lang-chips">
              <span className="lp-lang-chip lp-lang-chip--cpp">C++</span>
              <span className="lp-lang-chip lp-lang-chip--python">Python</span>
              <span className="lp-lang-chip lp-lang-chip--js">JavaScript</span>
            </div>
          </div>

          <div className="lp-hero-code" ref={heroRef} aria-hidden="true">
            <div className="lp-code-window">
              <div className="lp-code-titlebar">
                <span className="lp-dot lp-dot--red" />
                <span className="lp-dot lp-dot--yellow" />
                <span className="lp-dot lp-dot--green" />
                <span className="lp-code-filename">main.cpp</span>
              </div>
              <div className="lp-code-body">
                <div className="lp-code-lines">
                  {CODE_LINES.map((line, i) => (
                    <div key={i} className={`lp-code-line lp-code-line--${line.color}`} style={{ animationDelay: `${i * 0.18 + 0.4}s` }}>
                      <span className="lp-line-num">{i + 1}</span>
                      <span className="lp-line-text">{line.text}</span>
                    </div>
                  ))}
                  <div className="lp-cursor" style={{ animationDelay: "1.4s" }}>
                    <span className="lp-line-num">6</span>
                    <span className="lp-cursor-bar" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lp-float-badge lp-float-badge--1">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Կոդի գործարկում
            </div>
            <div className="lp-float-badge lp-float-badge--2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Առաջադրանքներ
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      {/* <section className="lp-how">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <p className="lp-section-eyebrow">Ինչպե՞ս է աշխատում</p>
            <h2 className="lp-section-title">4 քայլ — <span className="lp-title-accent">1 հաջողություն</span></h2>
            <p className="lp-section-sub">Ամեն թեմա կառուցված է նույն հստակ հաջորդականությամբ</p>
          </div>
          <div className="lp-how-grid">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="lp-how-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="lp-how-num">{s.num}</div>
                <div className="lp-how-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < HOW_STEPS.length - 1 && <div className="lp-how-arrow"><IconArrow /></div>}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══ FEATURES ══ */}
      <section className="lp-features">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <p className="lp-section-eyebrow">Հնարավորություններ</p>
            <h2 className="lp-section-title">Ամեն ինչ <span className="lp-title-accent">մեկ տեղում</span></h2>
            <p className="lp-section-sub">Դասեր, տեսանյութեր, կոդ, թեստ — ամբողջ ճանապարհը</p>
          </div>
          <div className="lp-feature-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`lp-feature-card lp-feature-card--${f.accent}`} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={`lp-feature-icon lp-feature-icon--${f.accent}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="lp-feature-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LANGUAGES ══ */}
      <section className="lp-langs">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <p className="lp-section-eyebrow">Ծրագրավորման լեզուներ</p>
            <h2 className="lp-section-title">Ինչ <span className="lp-title-accent">կսովորես</span></h2>
            <p className="lp-section-sub">Երեք լեզու, որ կբացեն IT աշխարհի դռները</p>
          </div>
          <div className="lp-lang-cards">
            {LANGS.map((lang) => (
              <div key={lang.tag} className={`lp-lang-card lp-lang-card--${lang.tag}`}>
                <div className="lp-lang-card-top">
                  <span className={`lp-lang-name lp-lang-name--${lang.tag}`}>{lang.name}</span>
                  <span className="lp-lang-level">{lang.level}</span>
                </div>
                <p className="lp-lang-desc">{lang.desc}</p>
                <ul className="lp-lang-points">
                  {lang.points.map(pt => (
                    <li key={pt}><span className="lp-lang-check"><IconCheck /></span>{pt}</li>
                  ))}
                </ul>
                <div className="lp-lang-bar">
                  <div className={`lp-lang-bar-fill lp-lang-bar-fill--${lang.tag}`} style={{ '--bar-w': `${lang.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOR WHOM ══ */}
      {/* <section className="lp-forwhom">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <p className="lp-section-eyebrow">Ու՞մ համար է</p>
            <h2 className="lp-section-title">CodeLabs-ը <span className="lp-title-accent">քո համար է</span></h2>
          </div>
          <div className="lp-forwhom-grid">
            {FOR_WHOM.map((fw, i) => (
              <div key={i} className="lp-forwhom-card">
                <span className="lp-forwhom-emoji">{fw.emoji}</span>
                <h3>{fw.title}</h3>
                <p>{fw.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══ WHY US ══ */}
      {/* <section className="lp-why">
        <div className="lp-section-inner">
          <div className="lp-why-inner">
            <div className="lp-why-text">
              <p className="lp-section-eyebrow">Ինչու՞ CodeLabs</p>
              <h2 className="lp-section-title">Հայերեն — <span className="lp-title-accent">ոչ թարգմանություն</span></h2>
              <p className="lp-why-desc">
                Ծրագրավորման հայերեն ռեսուրսները քիչ են ու ցրված։ CodeLabs-ում բոլոր նյութերը
                ի սկզբանե գրված են հայերենով — ոչ Google Translate, ոչ ռուսերենից ադապտացված։
              </p>
              <ul className="lp-why-list">
                {[
                  "Բոլոր դասերը հայ ուսուցիչների կողմից",
                  "Հայ ուսանողի տրամաբանությամբ կառուցված",
                  "Հստակ, ոչ չափազանց բարդ բացատրություններ",
                  "Անհատական հետևողականություն",
                  "Կառուցված հաջորդականություն՝ հիմքից մինչև advanced",
                ].map((item, i) => (
                  <li key={i}><span className="lp-why-check"><IconCheck /></span>{item}</li>
                ))}
              </ul>
            </div>
            <div className="lp-why-visual">
              <div className="lp-stat-card">
                <div className="lp-stat-row">
                  <div className="lp-stat-item">
                    <span className="lp-stat-num">3</span>
                    <span className="lp-stat-label">Ծրագրավորման<br/>լեզու</span>
                  </div>
                  <div className="lp-stat-divider" />
                  <div className="lp-stat-item">
                    <span className="lp-stat-num">4</span>
                    <span className="lp-stat-label">Ուսուցման<br/>փուլ</span>
                  </div>
                </div>
                <div className="lp-stat-divider lp-stat-divider--h" />
                <div className="lp-stat-row">
                  <div className="lp-stat-item">
                    <span className="lp-stat-num">100%</span>
                    <span className="lp-stat-label">Հայերեն<br/>բովանդակություն</span>
                  </div>
                  <div className="lp-stat-divider" />
                  <div className="lp-stat-item">
                    <span className="lp-stat-num">∞</span>
                    <span className="lp-stat-label">Կրկնվող<br/>հասանելիություն</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ══ FOOTER ══ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-brand lp-brand--sm">
            <CodeLabsLogo />
            <span className="lp-brand-text">Code<span className="lp-brand-accent">Labs</span></span>
          </div>
          <p className="lp-footer-copy">&copy; {new Date().getFullYear()} CodeLabs. Բոլոր իրավունքները պաշտպանված են։</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;