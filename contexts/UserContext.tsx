"use client";
import { createContext, useState, useContext } from "react";

// 定义性别类型
type Gender = "他" | "她" | null;

// 创建Context
export const UserContext = createContext<{
  gender: Gender;
  setGender: (gender: Gender) => void;
}>({
  gender: null,
  setGender: (gender) => {},
});

// 创建一个自定义Hook来使用UserContext
export const useUser = () => useContext(UserContext);

// 创建一个Provider组件
export const UserProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [gender, setGender] = useState<Gender>(null);

  return (
    <UserContext.Provider value={{ gender, setGender }}>
      {children}
    </UserContext.Provider>
  );
};
