"use client";

// staffcontext.tsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

type Staff = {
    id: string;
    username: string;
    lastName: string;
    mInit: string;
    firstName: string;
    dob: string;
    role: string;
    email: string;
    phone: string;
    address: string;
    qualification: string;
    salary: number;
};

const StaffContext = createContext<any>(undefined);

export const StaffProvider = ({ children }: { children: React.ReactNode }) => {
    const [staff, setStaff] = useState<Staff>({
        id: "",
        username: "",
        lastName: "",
        mInit: "",
        firstName: "",
        dob: "",
        role: "",
        email: "",
        phone: "",
        address: "",
        salary: 0,
        qualification: "",
    });

    const handleGetUserData = async (accessToken: string) => {
        try {
            const response = await axios.get("http://localhost:8080/auth/profile", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Store the user data in localStorage
            localStorage.setItem("id", response.data.id);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("lastName", response.data.lastName);
            localStorage.setItem("mInit", response.data.mInit);
            localStorage.setItem("firstName", response.data.firstName);
            localStorage.setItem("dob", response.data.dob);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("phone", response.data.phone);
            localStorage.setItem("address", response.data.address);
            localStorage.setItem("salary", response.data.salary.toString());
            localStorage.setItem("qualification", response.data.qualification);

            // Update the user state
            setStaff({
                id: response.data.id,
                username: response.data.username,
                lastName: response.data.lastName,
                mInit: response.data.mInit,
                firstName: response.data.firstName,
                dob: response.data.dob,
                role: response.data.role,
                email: response.data.email,
                phone: response.data.phone,
                address: response.data.address,
                salary: response.data.salary,
                qualification: response.data.qualification,
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
            setStaff({
                id: localStorage.getItem("id") || "",
                username: localStorage.getItem("username") || "",
                lastName: localStorage.getItem("lastName") || "",
                mInit: localStorage.getItem("mInit") || "",
                firstName: localStorage.getItem("firstName") || "",
                dob: localStorage.getItem("dob") || "",
                role: localStorage.getItem("role") || "",
                email: localStorage.getItem("email") || "",
                phone: localStorage.getItem("phone") || "",
                address: localStorage.getItem("address") || "",
                salary: parseFloat(localStorage.getItem("salary") || "0"),
                qualification: localStorage.getItem("qualification") || "",
            });
        }
    }, []);

    return (
        <StaffContext.Provider value={{ staff, setStaff }}>
            {children}
        </StaffContext.Provider>
    );
};

export function useStaffContext() {
    return useContext(StaffContext);
}
