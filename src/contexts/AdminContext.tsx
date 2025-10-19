import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  showAdminLogin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  openAdminPanel: () => void;
  closeAdminPanel: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminLogin(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === 'grvidal03@gmail.com' && password === '08052003') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const openAdminPanel = () => {
    setShowAdminLogin(true);
  };

  const closeAdminPanel = () => {
    setShowAdminLogin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, showAdminLogin, login, logout, openAdminPanel, closeAdminPanel }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
