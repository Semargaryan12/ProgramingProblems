import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link as Linko, scroller } from "react-scroll";
import { LanguageContext } from "../../context/LanguageContext";
import "./AdminNavbar.css";

const AdminNavbar = ({ toggleFooter }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);

  // ✅ վերցնում ենք Context-ից
  const { lang: selectedLanguage, changeLang, resetLang } = useContext(LanguageContext);

  // Օգտատիրոջ տվյալները
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [tasksDropdownOpen, setTasksDropdownOpen] = useState(false);
  const [createTaskDropdownOpen, setCreateTaskDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Context-ով language select
  const selectLang = (lang) => {
    changeLang(lang);

    if (location.pathname !== "/lessons") {
      navigate("/lessons");
    }
  };

  // ✅ Context-ով reset
  const handleResetLang = () => {
    resetLang();
    navigate("/user");
  };

  const handleScrollToFooter = () => {
    scroller.scrollTo("contacts-section", {
      smooth: true,
      duration: 500,
    });
    toggleFooter();
  };

  const isActive = (path) => location.pathname === path;
    const formatLanguage = (lang) => {
  const map = {
    cpp: "C++",
    javascript: "JavaScript",
    python: "Python",
    java: "Java"
  };
  return map[lang?.toLowerCase()] || lang;
};
  return (
    <nav className={`admin-navbar ${isSticky ? "fixed" : ""}`}>
      <div className="nav-center">
        <ul>
          {/* --- ADMIN SECTION --- */}
          {role === "admin" && (
            <>
              <li
                className="dropdown"
                onMouseEnter={() => setTasksDropdownOpen(true)}
                onMouseLeave={() => setTasksDropdownOpen(false)}
              >
                <span className="dropdown-toggle">Տեսնել ▾</span>
                {tasksDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li className={isActive("/questions/list") ? "active" : ""}>
                      <Link to="/questions/list">Առաջադրանքներ</Link>
                    </li>
                    <li className={isActive("/admin/lessons/list") ? "active" : ""}>
                      <Link to="/admin/lessons/list">Դասեր</Link>
                    </li>
                    <li className={isActive("/admin/quizzes/list") ? "active" : ""}>
                      <Link to="/admin/quizzes/list">Թեստեր</Link>
                    </li>
                    <li className={isActive("/admin/labs/list") ? "active" : ""}>
                      <Link to="/admin/labs/list">Գործնականներ</Link>
                    </li>
                    <li className={isActive("/admin/resource/list") ? "active" : ""}>
                      <Link to="/admin/resource/list">Ռեսուրսներ</Link>
                    </li>
                    <li className={isActive("/admin/video/list") ? "active" : ""}>
                      <Link to="/admin/video/list">Տեսադասեր</Link>
                    </li>
                  </ul>
                )}
              </li>

              <li
                className="dropdown"
                onMouseEnter={() => setCreateTaskDropdownOpen(true)}
                onMouseLeave={() => setCreateTaskDropdownOpen(false)}
              >
                <span className="dropdown-toggle">Ստեղծել ▾</span>
                {createTaskDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li><Link to="/admin/lessons/upload">Ստեղծել դաս</Link></li>
                    <li><Link to="/admin/quizzes/create">Ստեղծել թեստ</Link></li>
                    <li><Link to="/admin/resource/create">Ստեղծել այլ</Link></li>
                    <li><Link to="/admin/questions/create">Ստեղծել առաջադրանք</Link></li>
                    <li><Link to="/admin/labs/create">Ստեղծել գործնական</Link></li>
                    <li><Link to="/admin/video/create">Ներբեռնել վիդեո</Link></li>
                  </ul>
                )}
              </li>

              <li className={isActive("/admin/users/list") ? "active" : ""}>
                <Link to="/admin/users/list">Ուսանող</Link>
              </li>
            </>
          )}

          {/* --- USER SECTION --- */}
          {role === "user" && (
            !selectedLanguage ? (
              <>
                <li className="lang-option" onClick={() => selectLang("cpp")}>C++</li>
                <li className="lang-option" onClick={() => selectLang("python")}>Python</li>
                <li className="lang-option" onClick={() => selectLang("javascript")}>Javascript</li>
              </>
            ) : (
              <>
                <li onClick={handleResetLang} style={{ cursor: "pointer" }} title="Վերադառնալ">
                  <FontAwesomeIcon icon={faHouseChimney} />
                </li>

                <li className="selected-lang-badge">{formatLanguage(selectedLanguage)}</li>

                <li className={isActive("/lessons") ? "active" : ""}>
                  <Link to="/lessons">Դասեր</Link>
                </li>

                <li className={isActive("/videos") ? "active" : ""}>
                  <Link to="/videos">Տեսադասեր</Link>
                </li>

                <li className={isActive("/questions/list") ? "active" : ""}>
                  <Link to="/questions/list">Առաջադրանքներ</Link>
                </li>

                <li className={isActive("/quizzes/list") ? "active" : ""}>
                  <Link to="/quizzes/list">Թեստեր</Link>
                </li>

                {/* <li className={isActive("/labs/list") ? "active" : ""}>
                  <Link to="/labs/list">Լաբորատոր աշխատանք</Link>
                </li> */}

                <li className={isActive("/statisticfunc") ? "active" : ""}>
                  <Link to="/statisticfunc">Հավելյալ նյութեր</Link>
                </li>

                <li>
                  <Linko
                    to="contacts-section"
                    smooth={true}
                    duration={500}
                    onClick={handleScrollToFooter}
                  >
                    Կոնտակտ
                  </Linko>
                </li>
              </>
            )
          )}

          {/* --- SUPERADMIN --- */}
          {role === "superadmin" && (
            <li className={isActive("/superadmin") ? "active" : ""}>
              <Link to="/superadmin">Կառավարման վահանակ</Link>
            </li>
          )}
        </ul>
      </div>

      {role && (
        <button onClick={handleLogout} className="logout-button">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      )}
    </nav>
  );
};

export default AdminNavbar;