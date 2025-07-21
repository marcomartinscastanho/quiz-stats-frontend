import { createContext } from "react";
import type { User } from "../types/user";

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
