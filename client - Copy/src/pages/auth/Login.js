import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginService } from "../../components/AuthService/authService";
import "../../styles/loginRegister.css";

const Login = () => {
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  identifier: "",
  password: ""
});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name] || errors.server) setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.identifier) errs.email = "էլ․ հասցեն կամ մուտքանունը պարտադիր է";
    if (!formData.password) errs.password = "Գաղտնաբառը պարտադիր է";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) return setErrors(formErrors);

    setLoading(true);
    try {
      const { user } = await loginService(
  formData.identifier,
  formData.password
);
      
      const routes = { superadmin: "/superadmin", admin: "/admin" };
      navigate(routes[user?.role] || "/user");
    } catch (err) {
      const msg = err.message;
      // Friendly output logic
      if (msg.includes("հասցեով")) {
        setErrors({ email: msg });
      } else if (msg.includes("Գաղտնաբառը")) {
        setErrors({ password: msg });
      } else if (msg.includes("հաստատել")) {
        setErrors({ server: msg, needsVerify: true });
      } else {
        setErrors({ server: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-register-page">
      <div className="login-register-container-wrapper">
        <div className="login-register-container">
          <form onSubmit={handleSubmit} className="form-container">
            <h2>Մուտք</h2>

           <input
  name="identifier"
  placeholder="Էլ․ հասցե կամ մուտքանուն"
  value={formData.identifier}
  onChange={handleChange}
/>
            {errors.email && <p className="error-message">{errors.email}</p>}

            <input
              name="password"
              type="password"
              placeholder="Գաղտնաբառ"
              className={errors.password ? "input-error" : ""}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}

            {errors.server && <p className="error-message server-error">{errors.server}</p>}

            <button type="submit" disabled={loading}>
              {loading ? <div className="login-spinner"></div> : "Մուտք"}
            </button>

            <p style={{ marginTop: "20px" }}>
              Չունե՞ս էջ։ <Link to="/register">Գրանցվել</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;