import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/api";

const Verify = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/verify-email", { email: state?.email, code });
      alert("Էլ. հասցեն հաստատվեց:");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Սխալ կոդ");
    }
  };

  return (
    <div id="login-register-page">
      <div className="login-register-container-wrapper">
        <div className="login-register-container">
          <form onSubmit={handleVerify}>
            <h2>Հաստատում</h2>
            <p>Մուտքագրեք Ձեր էլ. հասցեին ուղարկված 6-նիշանոց կոդը:</p>
            <input 
              placeholder="6-նիշանոց կոդ" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Հաստատել</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verify;