"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/app/context";
import Link from "next/link";

export default function Dashboard() {
    const { user, setUser } = useUserContext();
    const [staffCount, setStaffCount] = useState(0);
    const [patientCount, setPatientCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const handleLogout = () => {
        localStorage.clear();
        setUser({
            username: "",
            role: "",
            email: "",
            id: "",
        });
        window.location.href = "/";
    };

    // Fetch staff count
    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://localhost:8080/staff", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStaffCount(response.data.length); // Assuming response.data is an array of staff
            } catch (error) {
                console.error("Error fetching staff data:", error);
                setErrorMessage("Failed to load staff data.");
            } finally {
                setLoading(false);
            }
        };
        fetchStaffData();
    }, []);

    // Fetch patient count
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem("accessToken");
                const response = await axios.get(`http://localhost:8080/patient/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setPatientCount(response.data.data.length); // Assuming response.data.data is an array of patients
            } catch (error) {
                console.error("Error fetching patient data:", error);
                setErrorMessage("Failed to load patient data.");
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, []);

    return (
        <main className="dashboard bg-[#E6F0FF] min-h-screen p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-semibold mb-6 text-gray-900">Admin Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Link href="/admin/staff">
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-[#1F2B6C] text-gray-800 hover:text-white transition-all duration-300 ease-in-out">
                            <h2 className="text-xl font-semibold transition-all duration-300 ease-in-out">
                                Total Staffs
                            </h2>
                            <p className="text-2xl font-bold text-blue-600 hover:text-white transition-all duration-300 ease-in-out">
                                {loading ? 'Loading...' : staffCount}
                            </p>
                        </div>
                    </Link>

                    <Link href="/admin/patient">
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-[#1F2B6C] text-gray-800 hover:text-white transition-all duration-300 ease-in-out">
                            <h2 className="text-xl font-semibold transition-all duration-300 ease-in-out">
                                Total Patients
                            </h2>
                            <p className="text-2xl font-bold text-blue-600 hover:text-white transition-all duration-300 ease-in-out">
                                {loading ? 'Loading...' : patientCount}
                            </p>
                        </div>
                    </Link>



                </div>

                <div className='admin-profile'>
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900">Admin Profile</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="text-gray-700 text-lg">
                            <strong>Username:</strong> {user.username}
                        </p>
                        <p className="text-gray-700 text-lg">
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p className="text-gray-700 text-lg">
                            <strong>Role:</strong> {user.role}
                            {user.role === 3
                                ? " - Patient"
                                : user.role === 2
                                    ? " - Staff"
                                    : user.role === 1
                                        ? " - Admin"
                                        : "Unknown Role"}
                        </p>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleLogout}
                            className="h-11 w-32 border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center
                            hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Log Out"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
}
