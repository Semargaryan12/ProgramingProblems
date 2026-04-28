import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { api } from '../api/api';
import '../styles/UserProfile.css';

/* ── SVG Icons ───────────────────────────────────────── */
const IconTask = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconQuiz = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconRocket = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>
);

const IconMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/>
    <line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

/* ── Loader ──────────────────────────────────────────── */
const Loader = () => (
  <div className="up-loader">
    <div className="up-ring" />
    <span>Բեռնվում է...</span>
  </div>
);

/* ── Roadmap Data ────────────────────────────────────── */
const FLOW_STEPS = [
  { icon: "📖", label: "Կարդա դասը",        desc: "Նախ ծանոթացիր տեսական նյութին" },
  { icon: "🎬", label: "Տեսադաս (անհրաժեշտության դեպքում)", desc: "Եթե նյութը պարզ չէ, դիտիր տեսադասը" },
  { icon: "💻", label: "Լուծիր խնդիրը",     desc: "Կիրառիր գիտելիքը գործնականում" },
  { icon: "✅", label: "Անցիր թեստը",        desc: "Ստուգիր քո իմացությունը" },
];

const ROADMAP = [
  {
    phase: 1,
    phaseLabel: "C++",
    color: "blue",
    steps: [
      {
        id: 1,
        title: "C++ — Հիմունքներ",
        desc: "Ծրագրավորման առաջին քայլերը C++ լեզվով՝ փոփոխականներ, տիպեր, հիմնական գործողություններ։",
        topics: ["Փոփոխականներ և տիպեր", "Պայմաններ (if/else)", "Ցիկլեր (for/while)", "Ֆունկցիաներ"],
        recommended: true,
      },
      {
        id: 2,
        title: "C++ — Intermediate",
        desc: "Ավելի խոր թեմաներ՝ զանգվածներ, pointer-ներ, հիշողության կառավարում։",
        topics: ["Զանգվածներ", "Pointer-ներ", "Reference-ներ", "Struct"],
      },
      {
        id: 3,
        title: "C++ — OOP",
        desc: "Օբյեկտ-կողմնորոշված ծրագրավորում C++-ով՝ class-եր, ժառանգություն, polymorphism։",
        topics: ["Class / Object", "Constructor", "Ժառանգություն", "Polymorphism"],
      },
    ],
  },
  {
    phase: 2,
    phaseLabel: "Python",
    color: "indigo",
    steps: [
      {
        id: 4,
        title: "Python — Հիմունքներ",
        desc: "Python-ի պարզ ու ընթեռնելի syntax-ը, հիմնական կառուցվածքները։",
        topics: ["Syntax & Indentation", "Ցուցակներ / Dict", "Ֆունկցիաներ", "Ֆայլեր"],
      },
      {
        id: 5,
        title: "Python — OOP & Գրադարաններ",
        desc: "Class-եր Python-ում և ամենաշատ օգտագործվող ստանդարտ գրադարաններ։",
        topics: ["Class / Inheritance", "Exception Handling", "os / sys", "json / csv"],
      },
    ],
  },
  {
    phase: 3,
    phaseLabel: "JavaScript",
    color: "violet",
    steps: [
      {
        id: 6,
        title: "JavaScript — Հիմունքներ",
        desc: "Վեբ ծրագրավորման հիմնական լեզուն՝ փոփոխականներ, ֆունկցիաներ, DOM։",
        topics: ["let / const / var", "Ֆունկցիաներ & Arrow fn", "DOM Manipulation", "Events"],
      },
      {
        id: 7,
        title: "JavaScript — Async & ES6+",
        desc: "Ժամանակակից JavaScript-ի հնարավորություններ՝ ասինխրոն ծրագրավորում, modules։",
        topics: ["Promise / Async-Await", "Fetch API", "ES6+ Features", "Modules"],
        isFinal: true,
      },
    ],
  },
];

const COLOR_MAP = {
  blue:    { pill: "up-pill--blue",   header: "up-card-header--blue",   step: "up-step--blue"   },
  indigo:  { pill: "up-pill--indigo", header: "up-card-header--indigo", step: "up-step--indigo" },
  violet:  { pill: "up-pill--violet", header: "up-card-header--violet", step: "up-step--violet" },
  emerald: { pill: "up-pill--emerald",header: "up-card-header--emerald",step: "up-step--emerald"},
  amber:   { pill: "up-pill--amber",  header: "up-card-header--amber",  step: "up-step--amber"  },
};

/* ── Roadmap Section ─────────────────────────────────── */
const RoadmapSection = () => {
  const [expanded, setExpanded] = useState(null);
  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div className="up-roadmap-wrap">
      <div className="up-roadmap-header">
        <div className="up-roadmap-header-icon"><IconMap /></div>
        <div>
          <h2>Ուսումնական Ուղի</h2>
          <p>Կայքի բովանդակությունը և դասերի խորհուրդ տրվող հաջորդականությունը</p>
        </div>
      </div>

      {/* ── Lesson flow strip ── */}
      <div className="up-flow-strip">
        {FLOW_STEPS.map((fs, i) => (
          <React.Fragment key={i}>
            <div className="up-flow-step">
              <span className="up-flow-icon">{fs.icon}</span>
              <span className="up-flow-label">{fs.label}</span>
              <span className="up-flow-desc">{fs.desc}</span>
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <div className="up-flow-arrow">→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* <div className="up-roadmap-body">
        {ROADMAP.map((phase, pi) => {
          const cls = COLOR_MAP[phase.color];
          return (
            <div key={phase.phase} className="up-phase">
              <div className={`up-phase-label up-phase-label--${phase.color}`}>
                <span className="up-phase-num">{phase.phase}</span>
                {phase.phaseLabel}
              </div>

              <div className="up-phase-steps">
                {phase.steps.map((step) => {
                  const isOpen = expanded === step.id;
                  return (
                    <div
                      key={step.id}
                      className={`up-step ${cls.step} ${isOpen ? 'up-step--open' : ''}`}
                    >
                      <div className="up-step-dot">
                        {step.isFinal
                          ? <IconStar />
                          : <span className="up-step-num">{step.id}</span>
                        }
                      </div>

                      <button
                        className="up-step-card"
                        onClick={() => toggle(step.id)}
                        aria-expanded={isOpen}
                      >
                        <div className="up-step-top">
                          <div className="up-step-info">
                            <span className="up-step-title">{step.title}</span>
                            {step.recommended && (
                              <span className="up-step-rec-badge">Սկսել այստեղից</span>
                            )}
                            {step.isFinal && (
                              <span className="up-step-final-badge">Ավարտ</span>
                            )}
                          </div>
                          <span className={`up-step-chevron ${isOpen ? 'up-step-chevron--up' : ''}`}>›</span>
                        </div>

                        {isOpen && (
                          <div className="up-step-detail">
                            <p className="up-step-desc">{step.desc}</p>
                            <div className="up-step-topics">
                              {step.topics.map(t => (
                                <span key={t} className={`up-topic-chip up-topic-chip--${phase.color}`}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}

                {pi < ROADMAP.length - 1 && (
                  <div className="up-phase-arrow">↓</div>
                )}
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

/* ── Main component ──────────────────────────────────── */
const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { navigate("/login"); return; }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "user") { navigate("/unauthorized"); return; }
      fetchUserData();
    } catch {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('auth/my-profile');
      setUserData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Չհաջողվեց բեռնել տվյալները։');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('hy-AM', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading) return <Loader />;

  if (error) return (
    <div className="up-error-wrap">
      <div className="up-error-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>{error}</p>
        <button className="up-retry-btn" onClick={fetchUserData}>Փորձել կրկին</button>
      </div>
    </div>
  );

  const taskCount  = userData.questionAnswers?.length ?? 0;
  const quizCount  = userData.quizSubmissions?.length ?? 0;
  const totalScore = userData.quizSubmissions?.reduce((s, q) => s + (q.score ?? 0), 0) ?? 0;

  return (
    <div className="up-root">

      {/* ── Hero ────────────────────────────────────── */}
      <header className="up-hero">
        <div className="up-hero-inner">
          <div className="up-avatar">
            {userData.name?.[0]}{userData.surname?.[0]}
          </div>
          <div className="up-hero-text">
            <h1>{userData.name} {userData.surname}</h1>
            <p className="up-email">{userData.email}</p>
            <span className={`up-badge ${userData.isBlocked ? 'up-badge--red' : 'up-badge--green'}`}>
              {userData.isBlocked ? 'Արգելափակված' : 'Ակտիվ'}
            </span>
          </div>
        </div>
      </header>

      {/* ── Stats strip ─────────────────────────────── */}
      <div className="up-stats-wrap">
        <div className="up-stats">
          <div className="up-stat">
            <span className="up-stat-num">{taskCount}</span>
            <span className="up-stat-label">Առաջադրանք</span>
          </div>
          <div className="up-stat-divider" />
          <div className="up-stat">
            <span className="up-stat-num">{quizCount}</span>
            <span className="up-stat-label">Անցած Թեստ</span>
          </div>
          <div className="up-stat-divider" />
          <div className="up-stat">
            <span className="up-stat-num">{totalScore}</span>
            <span className="up-stat-label">Ընդհանուր Միավոր</span>
          </div>
        </div>
      </div>

      {/* ── Progress banner ─────────────────────────── */}
      <div className="up-banner-wrap">
        <div className="up-banner">
          <div className="up-banner-icon"><IconRocket /></div>
          <div className="up-banner-body">
            <h2>Իմ Առաջադիմությունը</h2>
            <p>
              Յուրաքանչյուր լուծված խնդիր և անցած թեստ քայլ է դեպի պրոֆեսիոնալ ծրագրավորող դառնալուն։
              Հետևիր վիճակագրությանդ և բարելավիր արդյունքներդ ամեն օր։
            </p>
          </div>
          <div className="up-banner-tip">
            <strong>Խորհուրդ</strong>
            Անցիր լեզուների ուսուցումը հերթականությամբ՝ հիմունքներից դեպի բարդագույնները
          </div>
        </div>
      </div>

      {/* ── Roadmap ─────────────────────────────────── */}
      <div className="up-roadmap-outer">
        <RoadmapSection />
      </div>

      {/* ── Main grid ───────────────────────────────── */}
      <main className="up-grid">

        {/* Tasks */}
        <section className="up-card">
          <div className="up-card-header up-card-header--blue">
            <span className="up-card-icon"><IconTask /></span>
            <h3>Առաջադրանքներ</h3>
            <span className="up-card-count">{taskCount}</span>
          </div>
          <div className="up-card-body">
            {userData.questionAnswers?.length > 0 ? (
              userData.questionAnswers.map((item, i) => (
                <div key={i} className="up-list-item">
                  <div className="up-list-main">
                    <p className="up-list-title">
                      {item.questionId?.questionText || "Անհայտ առաջադրանք"}
                    </p>
                    <span className="up-list-date">
                      <IconCalendar />
                      {formatDate(item.submittedAt)}
                    </span>
                  </div>
                  <span className="up-pill up-pill--blue">Կատարված</span>
                </div>
              ))
            ) : (
              <div className="up-empty">
                <IconTask />
                <p>Դեռ չկան կատարված առաջադրանքներ</p>
              </div>
            )}
          </div>
        </section>

        {/* Quizzes */}
        <section className="up-card">
          <div className="up-card-header up-card-header--indigo">
            <span className="up-card-icon"><IconQuiz /></span>
            <h3>Թեստերի Արդյունքներ</h3>
            <span className="up-card-count">{quizCount}</span>
          </div>
          <div className="up-card-body">
            {userData.quizSubmissions?.length > 0 ? (
              userData.quizSubmissions.map((item, i) => (
                <div key={i} className="up-list-item">
                  <div className="up-list-main">
                    <p className="up-list-title">{item.quizId?.title || "Անհայտ թեստ"}</p>
                    <span className="up-list-date">
                      <IconCalendar />
                      {formatDate(item.submittedAt)}
                    </span>
                  </div>
                  <span className="up-pill up-pill--indigo">{item.score} Միավոր</span>
                </div>
              ))
            ) : (
              <div className="up-empty">
                <IconQuiz />
                <p>Թեստեր դեռ չեք անցել</p>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default UserProfile;