import React from "react";
import { useNavigate } from "react-router-dom";
import "./landingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Նավիգացիա */}
      <header className="landing-header">
        <div className="logo">CodeLabs</div>
        <div className="auth-buttons">
          <button className="nav-btn" onClick={() => navigate("/login")}>Մուտք</button>
          <button className="nav-btn primary" onClick={() => navigate("/register")}>Գրանցվել</button>
        </div>
      </header>

      {/* Գլխավոր բաժին (Hero Section) */}
      <section className="hero-section">
           <p>
            Բացահայտիր <b>C++, Python և JavaScript</b> լեզուների աշխարհը մեր համապարփակ հարթակում։ 
            Մենք տրամադրում ենք բոլոր անհրաժեշտ ռեսուրսները՝ սկսնակից մինչև պրոֆեսիոնալ մակարդակ բարձրանալու համար։
          </p>
       
          <h1>Սովորիր ծրագրավորում <span className="highlight">հայերենով</span></h1>
       
      
        
      </section>

      {/* Ռեսուրսների բաժին */}
      <section className="info-grid">
        <div className="info-card">
          <div className="icon">📚</div>
          <h3>Տեսական դասեր</h3>
          <p>Մանրամասն մշակված դասեր՝ գրված պարզ և հասկանալի հայերենով։</p>
        </div>
        <div className="info-card">
          <div className="icon">🎥</div>
          <h3>Տեսադասեր</h3>
          <p>Դիտիր պրակտիկ օրինակներով հագեցած տեսանյութեր ցանկացած ժամանակ։</p>
        </div>
        <div className="info-card">
          <div className="icon">💻</div>
          <h3>Առաջադրանքներ</h3>
          <p>Ամրապնդիր գիտելիքներդ գործնական խնդիրների և կոդի գրման միջոցով։</p>
        </div>
        <div className="info-card">
          <div className="icon">📝</div>
          <h3>Թեստեր</h3>
          <p>Ստուգիր առաջադիմությունդ ինտերակտիվ թեստերի օգնությամբ։</p>
        </div>
      </section>

      {/* Լեզուների բաժին */}
      <section className="languages-section">
        <h2>Ինչ լեզուներ ենք սովորում</h2>
        <div className="lang-tags">
          <span className="lang-tag cpp">C++</span>
          <span className="lang-tag python">Python</span>
          <span className="lang-tag js">JavaScript</span>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 CodeLabs. Բոլոր իրավունքները պաշտպանված են։</p>
      </footer>
    </div>
  );
};

export default LandingPage;