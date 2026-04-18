// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/photos/loginreg.png";
// import { loginService, registerService } from "../components/AuthService/authService";
// import { Link } from "react-router-dom";

// const LoginRegister = ({ isLogin }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     surname: "",
//     email: "",
//     password: "",
//     faculty: "",
//     course: "",
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validate = () => {
//     const errs = {};
//     if (!formData.email) errs.email = "Email is required";
//     if (!formData.password) errs.password = "Password is required";
//     if (!isLogin) {
//       if (!formData.name) errs.name = "First name is required";
//       if (!formData.surname) errs.surname = "Last name is required";
//       if (!formData.faculty) errs.faculty = "Faculty is required";
//       if (!formData.course) errs.course = "Course is required";
//     }
//     return errs;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formErrors = validate();
//     if (Object.keys(formErrors).length > 0) return setErrors(formErrors);

//     try {
//       if (isLogin) {
//         const { user } = await loginService(formData.email, formData.password);
//         navigate(user?.role === "admin" ? "/admin" : "/user");
//       } else {
//         await registerService(formData);
//         navigate("/login");
//       }
//     } catch (err) {
//       setErrors({ server: err.message });
//     }
//   };

//   return (
//     <div className="login-register-container">
//       <form onSubmit={handleSubmit} className="form-container">
//         <h2>{isLogin ? "Մուտք" : "Գրանցվել"}</h2>

//         {!isLogin && (
//           <>
//             <input
//               name="name"
//               placeholder="Անուն"
//               value={formData.name}
//               onChange={handleChange}
//             />
//             {errors.name && <p className="error-message">{errors.name}</p>}

//             <input
//               name="surname"
//               placeholder="Ազգանուն"
//               value={formData.surname}
//               onChange={handleChange}
//             />
//             {errors.surname && <p className="error-message">{errors.surname}</p>}

//             <input
//               name="email"
//               placeholder="Էլ․ հասցե"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             {errors.email && <p className="error-message">{errors.email}</p>}

//             <input
//               name="password"
//               type="password"
//               placeholder="Գաղտնաբառ"
//               value={formData.password}
//               onChange={handleChange}
//             />
//             {errors.password && <p className="error-message">{errors.password}</p>}

//             <input
//               name="faculty"
//               type="text"
//               placeholder="Ֆակուլտետ"
//               value={formData.faculty}
//               onChange={handleChange}
//             />
//             {errors.faculty && <p className="error-message">{errors.faculty}</p>}

//             <input
//               name="course"
//               type="text"
//               placeholder="Կուրս"
//               value={formData.course}
//               onChange={handleChange}
//             />
//             {errors.course && <p className="error-message">{errors.course}</p>}
//           </>
//         )}

//         {errors.server && <p className="error-message">{errors.server}</p>}

//         <button type="submit">{isLogin ? "Մուտք" : "Գրանցվել"}</button>

//         <p>
//           {isLogin ? "Չունե՞ս էջ։ " : "Արդեն ունե՞ս էջ։ "}
//           <Link to={isLogin ? "/register" : "/login"}>
//             {isLogin ? "Գրանցվել" : "Մուտք"}
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default LoginRegister;
