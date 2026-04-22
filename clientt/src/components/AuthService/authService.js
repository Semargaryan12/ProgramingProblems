import axios from "axios";
import { api } from "../../api/api";

// ✅ basicAxios must also use the env var — never hardcode localhost
export const axsi = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000/api", // ✅ from Vercel env vars
  withCredentials: true,
});

export const loginService = async (identifier, password) => {
  try {
    const { data } = await api.post("auth/login", { identifier, password });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  } catch (err) {
    console.log(err);

    throw new Error(err.response?.data?.error || "Սխալ");
  }
};

export const registerService = async (userInfo) => {
  try {
    const { data } = await api.post("/auth/register", userInfo);
    return data;
  } catch (err) {
    console.error("Registration failed", err);
    throw new Error(err.response?.data?.error || "Գրանցումը ձախողվեց");
  }
};

export const refreshAccessToken = async () => {
  try {
    // ✅ Use basicAxios here to avoid interceptor infinite loop
    const { data } = await axsi.post("/auth/refresh");
    const { accessToken, user } = data;

    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (user) localStorage.setItem("user", JSON.stringify(user));

    return { accessToken, user };
  } catch (err) {
    logoutClientSide();
    throw err;
  }
};

export const logoutService = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    logoutClientSide();
  }
};

const logoutClientSide = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
