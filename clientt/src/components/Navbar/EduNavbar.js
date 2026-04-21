import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBookOpen,
  faCode,
  faFlask,
  faLightbulb,
  faUserGraduate,
  faCircleInfo,
  faRightFromBracket,
  faUsersGear
} from "@fortawesome/free-solid-svg-icons";
import { Link as ScrollLink, scroller } from "react-scroll";
import "./EduNavbar.css";

const EduNavbar = ({ toggleFooter }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);
  const [manageDropdownOpen, setManageDropdownOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleScrollToFooter = () => {
    scroller.scrollTo("contact-section", {
      smooth: true,
      duration: 500,
    });
    toggleFooter?.();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`edu-navbar ${isSticky ? "fixed" : ""}`}>
      <div className="nav-center">
        <ul>
          {/* --- Common for all users --- */}
          <li className={isActive("/") ? "active" : ""}>
            <Link to="/"><FontAwesomeIcon icon={faHome} /> Գլխավոր</Link>
          </li>

          {role === "user" && (
            <>
                <li className={isActive("/videos") ? "active" : ""}>
                               <Link to="/videos">Տեսադասեր</Link>
                             </li>
              <li className={isActive("/lessons") ? "active" : ""}>
                <Link to="/lessons"><FontAwesomeIcon icon={faBookOpen} /> Դասեր</Link>
              </li>
              <li className={isActive("/tasks/list") ? "active" : ""}>
                <Link to="/tasks"><FontAwesomeIcon icon={faCode} /> Առաջադրանք</Link>
              </li>
              <li className={isActive("/quizzes/list") ? "active" : ""}>
                <Link to="/quizzes"><FontAwesomeIcon icon={faLightbulb} /> Թեստեր</Link>
              </li>
              <li className={isActive("/labs/list") ? "active" : ""}>
                <Link to="/labs"><FontAwesomeIcon icon={faFlask} /> Լաբորատոր աշխատանք</Link>
              </li>
              <li className={isActive("/resources") ? "active" : ""}>
                <Link to="/resources"><FontAwesomeIcon icon={faBookOpen} /> Ռեսուրսներ</Link>
              </li>
              <li>
                <ScrollLink
                  to="contact-section"
                  smooth={true}
                  duration={500}
                  onClick={handleScrollToFooter}
                >
                  <FontAwesomeIcon icon={faCircleInfo} /> Կոնտակտ
                </ScrollLink>
              </li>
            </>
          )}

          {role === "admin" && (
            <>
              <li
                className="dropdown"
                onMouseEnter={() => setManageDropdownOpen(true)}
                onMouseLeave={() => setManageDropdownOpen(false)}
              >
                <span className="dropdown-toggle">
                  <FontAwesomeIcon icon={faUsersGear} /> Կառավարել ▾
                </span>
                {manageDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li><Link to="/admin/lessons">Դասեր</Link></li>
                    <li><Link to="/admin/tasks/list">Առաջադրանքներ</Link></li>
                    <li><Link to="/admin/quizzes/list">Թեստեր</Link></li>
                    <li><Link to="/admin/labs/list">Լաբորատորներ</Link></li>
                    <li><Link to="/admin/resources">Ռեսուրսներ</Link></li>
                    <li><Link to="/admin/users">Ուսանողներ</Link></li>
                  </ul>
                )}
              </li>
            </>
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

export default EduNavbar;
