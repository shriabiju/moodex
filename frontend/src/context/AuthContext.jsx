import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../utils/constants";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`);
      setUser(res.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Set axios default header whenever token changes; fetch the current user
  // (or clear loading) in response to that change — standard sync-with-external-system effect.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token, fetchUser]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const { access_token } = res.data;
    localStorage.setItem("token", access_token);
    setToken(access_token);
  };

  const register = async (username, email, password) => {
    await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
    await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// This file intentionally exports both a component (AuthProvider) and a hook
// (useAuth). Splitting them into separate files would only improve dev-server
// Fast Refresh granularity — it has no effect on production behavior — and
// would require updating every importer across the app, so it's left as-is.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);