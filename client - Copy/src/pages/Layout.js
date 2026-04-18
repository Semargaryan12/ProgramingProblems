// src/components/Layout/Layout.jsx
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Element } from "react-scroll";
import "../components/Footer/Footer.css";

const Layout = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 5) {
        setIsFooterVisible(true);
      } else if (scrollTop < lastScrollTop.current - 100) {
        setIsFooterVisible(false);
      }
      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFooter = () => {
    setIsFooterVisible((v) => !v);
  };
  const hideFooter = () => {
    setIsFooterVisible(false);
  };

  return (
    <div className="layout">
      <Navbar toggleFooter={toggleFooter} />

      <main>{children}</main>

      {!isAdmin && (
        <Element name="contacts-section">
          <Footer isVisible={isFooterVisible} hideFooter={hideFooter} />
        </Element>
      )}
    </div>
  );
};

export default Layout;
