// AuthProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { AuthContextProps, AuthState, AuthActions } from "../interface/AuthContextProps";

const localStorageKey = "accessToken";
const AuthContext = createContext<AuthState & AuthActions>({
  accessToken: null,
  userEmail: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(localStorageKey)
  );
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const login = (token: string, email: string) => {
    setAccessToken(token);
    setUserEmail(email);
    localStorage.setItem(localStorageKey, token);
  };

  const logout = () => {
    setAccessToken(null);
    setUserEmail(null);
    localStorage.removeItem(localStorageKey);
  };

  return (
    <AuthContext.Provider value={{ accessToken, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
