import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiService';

const AuthContext = createContext(null);

const MOCK_USERS = [
  { id: '1', name: 'Mohammed Alami',   email: 'admin@ofppt.ma',       password: 'admin123', role: 'admin'       },
  { id: '2', name: 'Fatima Benali',    email: 'regional@ofppt.ma',    password: 'reg123',   role: 'regional', region: 'Casablanca-Settat' },
  { id: '3', name: 'Youssef Tazi',     email: 'local@ofppt.ma',       password: 'loc123',   role: 'local'       },
  { id: '4', name: 'Textile Maroc SA', email: 'company@textile.ma',   password: 'comp123',  role: 'company'     },
  { id: '5', name: 'Ahmed Rami',       email: 'intervenant@ofppt.ma', password: 'int123',   role: 'intervenant' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ofppt_user');
    if (saved) { try { setUser(JSON.parse(saved)); } catch (e) {} }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const data = await authAPI.login(cleanEmail, cleanPassword);
      if (data.success) {
        localStorage.setItem('ofppt_token', data.token);
        localStorage.setItem('ofppt_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Email ou mot de passe incorrect.' };
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        return { success: false, error: err.message || 'Email ou mot de passe incorrect.' };
      }
      console.warn('[Auth] API unavailable, using local fallback', err.message);
      const found = MOCK_USERS.find(u => u.email === cleanEmail && u.password === cleanPassword);
      if (found) {
        const { password: _, ...userObj } = found;
        localStorage.setItem('ofppt_user', JSON.stringify(userObj));
        setUser(userObj);
        return { success: true, user: userObj };
      }
      return { success: false, error: err.message || 'Email ou mot de passe incorrect.' };
    }
  };

  const register = async (formData) => {
    try {
      const data = await authAPI.register(formData);
      if (data.success) {
        localStorage.setItem('ofppt_token', data.token);
        localStorage.setItem('ofppt_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      }
    } catch (err) { console.warn('[Auth] Register API unavailable'); }
    const newUser = { id: Date.now().toString(), ...formData };
    const { password: _, ...userObj } = newUser;
    localStorage.setItem('ofppt_user', JSON.stringify(userObj));
    setUser(userObj);
    return { success: true, user: userObj };
  };

  const logout = () => {
    localStorage.removeItem('ofppt_token');
    localStorage.removeItem('ofppt_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('ofppt_user', JSON.stringify(updated));
  };

  const [uiNotifications] = useState([
    { id: 1, title: 'Nouvelle formation disponible', time: 'Il y a 2h', unread: true },
    { id: 2, title: 'Plan de formation validé', time: 'Il y a 1j', unread: true },
    { id: 3, title: 'Affectation reçue', time: 'Il y a 2j', unread: false },
  ]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser, notifications: uiNotifications, unreadCount: uiNotifications.filter(n => n.unread).length }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
