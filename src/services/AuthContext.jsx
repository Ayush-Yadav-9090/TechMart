import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "./api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===================== LOGIN ===================== */
  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });

    const { access, refresh } = res.data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    const profileRes = await authAPI.getProfile();
    const userData = profileRes.data;

    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));

    navigate(userData.is_staff ? "/admin/dashboard" : "/", { replace: true });
  };

  /* ===================== LOGOUT ===================== */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setLoading(false);
    navigate("/login", { replace: true });
  };

  /* ===================== LOAD USER ===================== */
  const loadUser = async () => {
    const token = localStorage.getItem("accessToken");

    //  NO token → skip profile call
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.getProfile();
      setUser(res.data);
    } catch (err) {
      //  DO NOT logout here — let interceptor decide
      console.warn("Profile load failed:", err?.response?.status);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
