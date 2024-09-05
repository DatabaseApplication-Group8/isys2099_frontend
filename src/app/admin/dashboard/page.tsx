"use client";
import React from 'react';
import { useUserContext } from "@/app/context";


export default function Dashboard() {
    const { user, setUser } = useUserContext();
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

    return (
        <main className="dashboard bg-[#E6F0FF] min-h-screen p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-semibold mb-6 text-gray-900">Admin Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Summary Cards */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800">Total Staffs</h2>
                        <p className="text-2xl font-bold text-blue-600">45</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800">Total Patients</h2>
                        <p className="text-2xl font-bold text-blue-600">150</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800">Reports Generated</h2>
                        <p className="text-2xl font-bold text-blue-600">30</p>
                    </div>
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
