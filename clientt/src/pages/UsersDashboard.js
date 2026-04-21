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

/* ── Loader ──────────────────────────────────────────── */
const Loader = () => (
  <div className="up-loader">
    <div className="up-ring" />
    <span>Բեռնվում է...</span>
  </div>
);

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

  /* ── States ──────────────────────────────────────── */
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

  const taskCount = userData.questionAnswers?.length   ?? 0;
  const quizCount = userData.quizSubmissions?.length   ?? 0;
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