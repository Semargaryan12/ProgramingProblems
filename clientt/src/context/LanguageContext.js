import { createContext, useState } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("prefLang"));

  const changeLang = (newLang) => {
    localStorage.setItem("prefLang", newLang);
    setLang(newLang);
  };

  const resetLang = () => {
    localStorage.removeItem("prefLang");
    setLang(null);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, resetLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
