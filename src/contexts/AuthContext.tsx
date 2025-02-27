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
  UserBasicInfo?: () => Promise<void>;
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

  async function UserBasicInfo() {
    const res = await recreateAccessToken();
    if (!res) return;

    const userData = await getUserBasicInfo(res.accessToken);

    setJWTAccessToken(res.accessToken);
    setUserData({ name: userData.name, email: userData.email });
  }

  async function logOut() {
    await logoutUser();
    setAccessToken(undefined);
    setUser(undefined);
  }

  React.useEffect(() => {
    UserBasicInfo();
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        setJWTAccessToken,
        setUserData,
        logOut,
        UserBasicInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
