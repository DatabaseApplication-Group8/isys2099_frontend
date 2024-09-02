"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { IPatient } from '@/types/user';

export default function Patient() {
    const [patientList, setPatientList] = useState<IPatient[]>([]);
    const [filteredPatient, setFilteredPatient] = useState<IPatient | null>(null);
    const [searchId, setSearchId] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch all patients
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('/api/patients');
                setPatientList(response.data);
                setFilteredPatient(null); // Reset filteredPatient on new fetch
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Handle search by patient ID
    const handleSearch = () => {
        const patient = patientList.find(p => p.id === searchId);
        setFilteredPatient(patient || null);
    };

    const handleDeletePatient = (id: string) => {
        setPatientList(patientList.filter(p => p.id !== id));
        if (filteredPatient && filteredPatient.id === id) {
            setFilteredPatient(null);
        }
        setSuccessMessage(`Patient with ID ${id} deleted successfully.`);
    };

    const handleUpdatePatient = (id: string, updatedData: Partial<IPatient>) => {
        const updatedPatientList = patientList.map(p => (p.id === id ? { ...p, ...updatedData } : p));
        setPatientList(updatedPatientList);
        if (filteredPatient && filteredPatient.id === id) {
            setFilteredPatient({ ...filteredPatient, ...updatedData });
        }
        setSuccessMessage(`Patient with ID ${id} updated successfully.`);
    };

    return (
        <main className="patient bg-[#E6F0FF] min-h-screen pt-2">
            <div className="container mx-auto">
                <h1 className="text-3xl font-semibold text-gray-900">Patient Database Management</h1>
                <div className="flex flex-row justify-end mb-6">
                    <div className="add-patient-field">
                        <Link href="/admin/addpatient">
                            <button className="h-[50px] bg-[#1F2B6C] text-white py-2 px-4 rounded-md hover:shadow-lg">
                                Add New Patient
                            </button>
                        </Link>
                    </div>
                </div>

                <div className='patient-database-container bg-white rounded-lg shadow-lg overflow-y-auto'>
                    <table className="w-full text-left h-[250px]">
                        <thead className="bg-[#1F2B6C] text-white">
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Password</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-2 px-4 text-center text-gray-500">
                                        There are no patients yet!
                                    </td>
                                </tr>
                            ) : filteredPatient ? (
                                <tr key={filteredPatient.id}>
                                    <td className="py-2 px-4 border-b">{filteredPatient.id}</td>
                                    <td className="py-2 px-4 border-b">{filteredPatient.firstName} {filteredPatient.lastName}</td>
                                    <td className="py-2 px-4 border-b">{filteredPatient.email}</td>
                                    <td className="py-2 px-4 border-b">{filteredPatient.password}</td>
                                    <td className="py-2 px-4 border-b">
                                        <div className='flex flex-row'>
                                            <button onClick={() => handleUpdatePatient(filteredPatient.id, { department: "Updated Department" })} className="bg-blue-600 text-white py-2 px-4 rounded-md mt-2 mr-2">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeletePatient(filteredPatient.id)} className="bg-red-600 text-white py-2 px-4 rounded-md mt-2">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-2 px-4 text-center text-gray-500">
                                        No patients found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-12">
                <label className="block text-lg font-medium text-gray-700">Search Patient by ID</label>
                    <div className="search-field mb-6 flex items-center space-x-4">
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="px-4 py-2 border rounded-lg flex-1"
                            placeholder="Enter Patient ID"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-[#1F2B6C] text-white px-4 py-2 rounded-lg">
                            Search
                        </button>
                    </div>

                    {/* Display Searched Patient */}
                    {filteredPatient && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Patient Details</h2>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <p className="text-gray-700 text-lg"><strong>ID:</strong> {filteredPatient.id}</p>
                                <p className="text-gray-700 text-lg"><strong>Name:</strong> {filteredPatient.firstName} {filteredPatient.lastName}</p>
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
                </div>
            </div>
        </main>
    );
}
