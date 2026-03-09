import type React from "react";
import { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------
// OWNER EMAIL: Change this to your actual Gmail address.
// This email will:
//   1. Receive login & registration alerts via formsubmit.co
//   2. Get access to the "Add Product" button on the Products page
// ---------------------------------------------------------------
export const OWNER_EMAIL = "prettylittlethings.owner@gmail.com";

interface AuthContextValue {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  isAdminLoggedIn: boolean;
  setAdminLoggedIn: (val: boolean) => void;
  isOwner: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_EMAIL_KEY = "plt_user_email";
const ADMIN_KEY = "plt_admin_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmailState] = useState<string | null>(() =>
    localStorage.getItem(USER_EMAIL_KEY),
  );
  const [isAdminLoggedIn, setAdminLoggedInState] = useState<boolean>(
    () => localStorage.getItem(ADMIN_KEY) === "true",
  );

  const setUserEmail = (email: string | null) => {
    setUserEmailState(email);
    if (email) {
      localStorage.setItem(USER_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(USER_EMAIL_KEY);
    }
  };

  const setAdminLoggedIn = (val: boolean) => {
    setAdminLoggedInState(val);
    if (val) {
      localStorage.setItem(ADMIN_KEY, "true");
    } else {
      localStorage.removeItem(ADMIN_KEY);
    }
  };

  const logout = () => {
    setUserEmail(null);
    setAdminLoggedIn(false);
  };

  // True when the logged-in user's email matches the owner email
  const isOwner =
    !!userEmail &&
    userEmail.trim().toLowerCase() === OWNER_EMAIL.trim().toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        userEmail,
        setUserEmail,
        isAdminLoggedIn,
        setAdminLoggedIn,
        isOwner,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
