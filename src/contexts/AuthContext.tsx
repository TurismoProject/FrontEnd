"use client";

import {
  getUserBasicInfo,
  logoutUser,
  recreateAccessToken,
} from "@/app/actions";
import React from "react";

interface User {
  name?: string;
  email: string;
}

interface AuthContextProps {
  user?: User;
  accessToken?: string;
  setJWTAccessToken?: (token: string) => void;
  setUserData?: (user: User) => void;
  logOut?: () => void;
}

const AuthContext = React.createContext<AuthContextProps>({});

export const useAuth = () => React.useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = React.useState<string>();
  const [user, setUser] = React.useState<User>();

  function setJWTAccessToken(token: string) {
    setAccessToken(() => token);
  }

  function setUserData(user: User) {
    setUser(() => user);
  }

  async function logOut() {
    await logoutUser();
    setAccessToken(undefined);
    setUser(undefined);
  }

  React.useEffect(() => {
    async function keepUserLogged() {
      const res = await recreateAccessToken();
      if (!res) return;

      const userData = await getUserBasicInfo(res.accessToken);

      setJWTAccessToken(res.accessToken);
      setUserData({ name: userData.name, email: userData.email });
    }

    keepUserLogged();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        setJWTAccessToken,
        setUserData,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
