"use client";
import React from 'react';

export default function Dashboard() {
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

            </div>
        </main>
    );
}
