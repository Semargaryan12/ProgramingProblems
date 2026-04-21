import axios from "axios";
import { api } from "../../api/api";

// Use a base axios instance for the refresh call to avoid interceptor loops
const basicAxios = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const loginService = async (identifier, password) => {
  try {
    const { data } = await api.post("/auth/login", {
      identifier,
      password,
    });

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (err) {
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
    // FIX: Use basicAxios here, NOT the 'api' instance
    const { data } = await basicAxios.post("/auth/refresh");
    const { accessToken, user } = data;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return { accessToken, user };
  } catch (err) {
    // If refresh fails, the user session is truly dead
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
    // Always clear storage even if the server-side logout fails
    logoutClientSide();
  }
};

// Helper to clean up local data
const logoutClientSide = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  // Optional: Redirect to login if not already there
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
