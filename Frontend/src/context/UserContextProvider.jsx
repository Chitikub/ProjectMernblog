import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import TokenService from "../services/token.service";

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    return TokenService.getUser() || null;
  });

  const login = (user) => setUserInfo(user);

  const logout = () => {
    TokenService.removeUser();
    setUserInfo(null);
  };

  useEffect(() => {
    if (userInfo) {
      TokenService.setUser(userInfo);
    }
  }, [userInfo]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
