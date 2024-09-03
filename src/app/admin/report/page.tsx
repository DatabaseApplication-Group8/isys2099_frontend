"use client";
import React, { useState } from 'react';

export default function Report() {
    const [patientId, setPatientId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reports, setReports] = useState([]);
    const [doctorId, setDoctorId] = useState('');

    // Placeholder function to fetch reports based on parameters
    const fetchReports = async (type) => {
        let endpoint = '';

        switch (type) {
            case 'patientHistory':
                endpoint = `/api/reports/patient-history?patientId=${patientId}&startDate=${startDate}&endDate=${endDate}`;
                break;
            case 'allPatientTreatment':
                endpoint = `/api/reports/all-patient-treatment?startDate=${startDate}&endDate=${endDate}`;
                break;
            case 'staffJobChange':
                endpoint = `/api/reports/staff-job-change?startDate=${startDate}&endDate=${endDate}`;
                break;
            case 'doctorWork':
                endpoint = doctorId 
                    ? `/api/reports/doctor-work?doctorId=${doctorId}&startDate=${startDate}&endDate=${endDate}`
                    : `/api/reports/all-doctors-work?startDate=${startDate}&endDate=${endDate}`;
                break;
            default:
                return;
        }

        const response = await fetch(endpoint);
        const data = await response.json();
        setReports(data);
    };

    return (
        <main className="report min-h-screen p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-semibold mb-6 text-gray-900">Report Management</h1>

                {/* Patient Treatment History */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">View Patient Treatment History</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <input
                            type="text"
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                            placeholder="Patient ID"
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                        />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                        />
                        <button
                            onClick={() => fetchReports('patientHistory')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            View History
                        </button>
                    </div>
                </div>

                {/* All Patient Treatment in Given Duration */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">View All Patient Treatment in Given Duration</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                        />
                        <button
                            onClick={() => fetchReports('allPatientTreatment')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            View Treatments
                        </button>
                    </div>
                </div>

                {/* Staff Job Change History */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">View Staff Job Change History</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                        />
                        <button
                            onClick={() => fetchReports('staffJobChange')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            View Job Changes
                        </button>
                    </div>
                </div>

                {/* Doctor's Work in Given Duration */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">View Doctor's Work in Given Duration</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <input
                            type="text"
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                            placeholder="Doctor ID (Optional for All Doctors)"
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                        />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                        />
                        <button
                            onClick={() => fetchReports('doctorWork')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            View Work
                        </button>
                    </div>
                </div>

                {/* Display Reports */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Report Results</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        {reports.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {reports.map((report, index) => (
                                    <li key={index} className="text-gray-700 text-lg">
                                        {JSON.stringify(report)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 text-lg">No reports available.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
