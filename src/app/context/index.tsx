import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";

type User = {
  username: string;
  role: string;
  id: string;
  email: string;
};

// Create a UserContext
const UserContext = createContext<any>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({ username: "", role: "", id: "", email: "" });

  const handleGetUserData = async (accessToken: string) => {
    try {
      // Make the GET request with the access token in the headers
      const response = await axios.get("http://localhost:8080/auth/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Store the user data in localStorage
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("id", response.data.id);

      // Update the user state
      setUser({
        username: response.data.username,
        role: response.data.role,
        email: response.data.email,
        id: response.data.id,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      handleGetUserData(accessToken);
    } else {
      const storedUsername = localStorage.getItem("username");
      const storedRole = localStorage.getItem("role");
      const storedEmail = localStorage.getItem("email");
      const storedId = localStorage.getItem("id");

      setUser({
        username: storedUsername || "",
        role: storedRole || "",
        email: storedEmail || "",
        id: storedId || "",
      });
    }
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export function useUserContext(){
    return useContext(UserContext)
}

