import { ReactNode, createContext, useContext, useState } from 'react';

export type UserType = 'private' | 'public' | null;

interface AuthContextType {
  userType: UserType;
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  userPhone: string;
  theme: 'light' | 'dark';
  login: (type: UserType) => void;
  logout: () => void;
  updateProfile: (name: string, email?: string, phone?: string) => void;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load saved data on mount
  useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedType = localStorage.getItem('userType') as UserType;
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedPhone = localStorage.getItem('userPhone');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    
    if (savedAuth === 'true' && savedType) {
      setIsAuthenticated(true);
      setUserType(savedType);
      setUserName(savedName || '');
      setUserEmail(savedEmail || '');
      setUserPhone(savedPhone || '');
      setTheme(savedTheme || 'light');
    }
  });

  const login = (type: UserType) => {
    setUserType(type);
    setIsAuthenticated(true);
    localStorage.setItem('userType', type || '');
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setUserType(null);
    setIsAuthenticated(false);
    setUserName('');
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
  };

  const updateProfile = (name: string, email?: string, phone?: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    if (email !== undefined) {
      setUserEmail(email);
      localStorage.setItem('userEmail', email);
    }
    if (phone !== undefined) {
      setUserPhone(phone);
      localStorage.setItem('userPhone', phone);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <AuthContext.Provider value={{
      userType,
      isAuthenticated,
      userName,
      userEmail,
      userPhone,
      theme,
      login,
      logout,
      updateProfile,
      toggleTheme
    }}>
      {children}
    </AuthContext.Provider>
  );
}