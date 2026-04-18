import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerService } from "../../components/AuthService/authService";
import "../../styles/loginRegister.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", surname: "", username: "", email: "", password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    Object.keys(formData).forEach(key => {
        if (!formData[key]) errs[key] = "Դաշտը պարտադիր է";
    });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) return setErrors(formErrors);

    setLoading(true);
    try {
      await registerService(formData);
      // Redirect to a verification page, passing the email via state
      navigate("/verify", { state: { email: formData.email } });
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-register-page">
      <div className="login-register-container-wrapper">
        <div className="login-register-container" style={{ width: "500px" }}>
          <form onSubmit={handleSubmit} className="form-container">
            <h2>Գրանցվել</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                    <input name="name" placeholder="Անուն" className={errors.name ? "input-error" : ""} onChange={handleChange} />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>
                <div>
                    <input name="surname" placeholder="Ազգանուն" className={errors.surname ? "input-error" : ""} onChange={handleChange} />
                    {errors.surname && <p className="error-message">{errors.surname}</p>}
                </div>
                
            </div>
              <input
  name="username"
  placeholder="Մուտքանուն"
  onChange={handleChange}
/>
            <input name="email" placeholder="Էլ․ հասցե" className={errors.email ? "input-error" : ""} onChange={handleChange} />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <input name="password" type="password" placeholder="Գաղտնաբառ" className={errors.password ? "input-error" : ""} onChange={handleChange} />
            {errors.password && <p className="error-message">{errors.password}</p>}

            

            {errors.server && <p className="error-message">{errors.server}</p>}

            <button type="submit" disabled={loading}>
              {loading ? <div className="login-spinner"></div> : "Գրանցվել"}
            </button>

            <p style={{ marginTop: "20px" }}>
              Արդեն ունե՞ս էջ։ <Link to="/login">Մուտք</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;