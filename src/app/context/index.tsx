"use client";
import axios from "axios";
import { createContext, useState, useEffect, useContext, ReactNode } from "react";

type User = {
  id: string;
  role: string;
  username: string;
  firstName: string;
  mInit: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
};

// Define a type for the context value
type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

// Create a UserContext with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: "",
    role: "",
    username: "",
    firstName: "",
    mInit: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    address: ""
  });

  const handleGetUserData = async (accessToken: string) => {
    try {
      const response = await axios.get<User>("http://localhost:8080/auth/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Store the user data in localStorage
      const userData = response.data;
      Object.keys(userData).forEach(key => localStorage.setItem(key, userData[key as keyof User] || ''));

      // Update the user state
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      handleGetUserData(accessToken);
    } else {
      // Fetch stored user data from localStorage
      const storedUser: User = {
        id: localStorage.getItem("id") || "",
        role: localStorage.getItem("role") || "",
        username: localStorage.getItem("username") || "",
        firstName: localStorage.getItem("firstName") || "",
        mInit: localStorage.getItem("mInit") || "",
        lastName: localStorage.getItem("lastName") || "",
        dob: localStorage.getItem("dob") || "",
        email: localStorage.getItem("email") || "",
        phone: localStorage.getItem("phone") || "",
        address: localStorage.getItem("address") || ""
      };
      setUser(storedUser);
    }
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
