import { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load cached session
  useEffect(() => {
    const cachedUser = localStorage.getItem('user');
    const cachedToken = localStorage.getItem('token');
    if (cachedToken) setAuthToken(cachedToken);
    if (cachedUser) setUser(JSON.parse(cachedUser));
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    // role is optional (server will ignore if not provided), but we pass it to validate role at login
    const { data } = await api.post('/auth/login', { email, password, role });
    setAuthToken(data.token);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (name, email, password, role = 'user') => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    setAuthToken(data.token);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
