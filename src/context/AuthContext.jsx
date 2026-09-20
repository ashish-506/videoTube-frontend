import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // On first load, ask the backend "am I already logged in?" via the
  // accessToken cookie. This is what lets a page refresh keep the user
  // signed in instead of bouncing them back to /login every time.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/users/current-user");
        setUser(data.data);
      } catch {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const login = async ({ identifier, password }) => {
    // The backend accepts either username or email under those two field
    // names — send whichever the user typed as both, the controller only
    // uses whichever one is present.
    const { data } = await api.post("/users/login", {
      username: identifier,
      email: identifier,
      password,
    });
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (formData) => {
    // formData is a FormData instance (see Register.jsx) because this
    // endpoint accepts multipart/form-data — required avatar file included.
    const { data } = await api.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  };

  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checkingAuth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
