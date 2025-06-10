import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Helper functions for storage
  const getStoredUser = () => {
    const saved = sessionStorage.getItem("user") || localStorage.getItem("user");
    try {
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };
  const getStoredToken = () =>
    sessionStorage.getItem("token") || localStorage.getItem("token") || "";

  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    setUser(getStoredUser());
    setToken(getStoredToken());
  }, []);

  // Login function with rememberMe
const login = async (email, password, rememberMe = false, isAdmin = false) => {
  const endpoint = isAdmin ? "/api/auth/admin-login" : "/api/auth/login";
  const res = await axios.post(endpoint, { email, password });
  if (!res.data || !res.data.user || !res.data.token) {
    throw new Error("Invalid login response from server");
  }
  setUser(res.data.user);
  setToken(res.data.token);

  // Token को axios default headers में set करें
  axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

  if (rememberMe) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  } else {
    sessionStorage.setItem("user", JSON.stringify(res.data.user));
    sessionStorage.setItem("token", res.data.token);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
};


  // Logout: clear both storages
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
