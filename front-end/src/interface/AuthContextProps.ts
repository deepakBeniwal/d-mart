
import { ReactNode } from "react";

export interface AuthContextProps {
  children: ReactNode;
}

// interface/AuthState.ts
export interface AuthState {
  accessToken: string | null;
  userEmail: string | null;
}

// interface/AuthActions.ts
export interface AuthActions {
  login: (token: string, email: string) => void;
  logout: () => void;
}
