"use client";
import React, { useState, useEffect } from 'react';

export default function Patient() {
    const [patients, setPatients] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [filteredPatient, setFilteredPatient] = useState(null);

    // Fetch all patients (placeholder function)
    useEffect(() => {
        // Fetch data from your API or database
        const fetchPatients = async () => {
            // Replace with actual data fetching logic
            const response = await fetch('/api/patients'); // Example API endpoint
            const data = await response.json();
            setPatients(data);
        };
        
        fetchPatients();
    }, []);

    // Handle search by patient ID
    const handleSearch = () => {
        const patient = patients.find(p => p.id === searchId);
        setFilteredPatient(patient || null);
    };

    return (
        <main className="patient bg-[#E6F0FF] min-h-screen p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-semibold mb-6 text-gray-900">Patient Management</h1>

                {/* Search Patient by ID */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700">Search Patient by ID</label>
                    <div className="flex gap-2 mt-2">
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="px-4 py-2 border rounded-lg flex-1"
                            placeholder="Enter Patient ID"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            Search
                        </button>
                    </div>
                </div>

                {/* Display Searched Patient */}
                {filteredPatient && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Patient Details</h2>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 text-lg"><strong>ID:</strong> {filteredPatient.id}</p>
                            <p className="text-gray-700 text-lg"><strong>Name:</strong> {filteredPatient.name}</p>
                            <p className="text-gray-700 text-lg"><strong>Email:</strong> {filteredPatient.email}</p>
                            {/* Additional patient details */}
                        </div>

                        {/* Treatment History */}
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Treatment History</h3>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                {filteredPatient.treatmentHistory && filteredPatient.treatmentHistory.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {filteredPatient.treatmentHistory.map((treatment, index) => (
                                            <li key={index} className="text-gray-700 text-lg">
                                                {treatment.date}: {treatment.description}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No treatment history available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* View All Patients */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Patients</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <ul className="list-disc pl-5">
                            {patients.map((patient, index) => (
                                <li key={index} className="text-gray-700 text-lg">
                                    ID: {patient.id} - Name: {patient.name} - Email: {patient.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
