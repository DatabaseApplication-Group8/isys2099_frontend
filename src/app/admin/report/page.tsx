"use client";
import React, { useState } from 'react';
import axios from 'axios';

import {
    mockPatientTreatmentHistory,
    mockAllPatientTreatments,
    mockJobChangeHistory,
    mockDoctorWork
} from './mockData';

// Define types for the reports
type TreatmentHistory = {
    id: string;
    date: string;
    time: string;
    doctor: string;
    status: 'pending' | 'completed' | 'canceled';
};

type JobChange = {
    staffId: string;
    changeDate: string;
    previousRole: string;
    newRole: string;
};

type DoctorWork = {
    doctorId: string;
    patientId: string;
    treatmentDate: string;
    treatmentId: string;
};

const Button = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button
        onClick={onClick}
        className="bg-[#1F2B6C] text-white px-4 py-2 rounded-lg hover:bg-[#153C6B] transition-colors "
    >
        {children}
    </button>
);

const Table = ({ columns, data }: { columns: string[], data: any[] }) => (
    <div className="bg-white rounded-lg shadow-lg mb-6">
        <table className="w-full text-left border-collapse">
            <thead className="bg-[#1F2B6C] text-white">
                <tr>
                    {columns.map((col, index) => (
                        <th key={index} className="py-3 px-4 border-b">{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100 transition-colors">
                        {Object.values(row).map((val, colIndex) => (
                            <td key={colIndex} className="py-2 px-4 border-b">{val}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default function AdminDashboard() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [staffId, setStaffId] = useState('');
    const [patientTreatmentHistory, setPatientTreatmentHistory] = useState<TreatmentHistory[]>([]);
    const [allPatientTreatments, setAllPatientTreatments] = useState<TreatmentHistory[]>([]);
    const [jobChangeHistory, setJobChangeHistory] = useState<JobChange[]>([]);
    const [doctorWork, setDoctorWork] = useState<DoctorWork[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [dateRangeError, setDateRangeError] = useState<string | null>(null);
    const [dataFetched, setDataFetched] = useState<{ patientTreatmentHistory: boolean, allPatientTreatments: boolean, doctorWork: boolean, jobChangeHistory: boolean }>({
        patientTreatmentHistory: false,
        allPatientTreatments: false,
        doctorWork: false,
        jobChangeHistory: false
    });
    const useMockData = true;

    // Validate date range
    const validateDateRange = () => {
        if (!startDate || !endDate) {
            setDateRangeError('Both start date and end date are required.');
            return false;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            setDateRangeError('End date must be after start date.');
            return false;
        }
        setDateRangeError(null);
        return true;
    };

    const filterDataByDateRange = (data: any[], dateKey: string) => {
        return data.filter(item => {
            const itemDate = new Date(item[dateKey]);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
    };

    const fetchData = async (url: string, params: object, setter: React.Dispatch<React.SetStateAction<any[]>>, dateKey: string, key: keyof typeof dataFetched) => {
        try {
            let data = [];
            if (useMockData) {
                if (url === '/api/patient-treatment-history') {
                    data = mockPatientTreatmentHistory;
                } else if (url === '/api/all-patient-treatments') {
                    data = mockAllPatientTreatments;
                } else if (url === '/api/doctor-work') {
                    data = mockDoctorWork;
                } else if (url === '/api/job-change-history') {
                    data = mockJobChangeHistory;
                }
            } else {
                const response = await axios.get(url, { params });
                data = response.data;
            }

            const filteredData = filterDataByDateRange(data, dateKey);
            setter(filteredData);
            setDataFetched(prev => ({ ...prev, [key]: true }));
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(`Error fetching data from ${url}.`);
        }
    };

    const handleViewPatientHistory = async () => {
        if (!validateDateRange()) return;
        await fetchData('/api/patient-treatment-history', { startDate, endDate }, setPatientTreatmentHistory, 'date', 'patientTreatmentHistory');
    };

    const handleViewAllPatientTreatments = async () => {
        if (!validateDateRange()) return;
        await fetchData('/api/all-patient-treatments', { startDate, endDate }, setAllPatientTreatments, 'date', 'allPatientTreatments');
    };

    const handleViewDoctorWork = async () => {
        if (!validateDateRange()) return;
        await fetchData('/api/doctor-work', { startDate, endDate }, setDoctorWork, 'treatmentDate', 'doctorWork');
    };

    const handleViewJobChangeHistory = async () => {
        if (!staffId) {
            setErrorMessage('Staff ID is required.');
            return;
        }
    
        try {
            let data = [];
            if (useMockData) {
                data = mockJobChangeHistory.filter(item => item.staffId === staffId);
            } else {
                const response = await axios.get('/api/job-change-history', { params: { staffId } });
                data = response.data;
            }
    
            if (data.length === 0) {
                setErrorMessage('No job change history found for the given Staff ID.');
            } else {
                setErrorMessage(null);
                setJobChangeHistory(data);
            }
    
            setDataFetched(prev => ({ ...prev, jobChangeHistory: true }));
        } catch (error) {
            setErrorMessage('Error fetching job change history.');
        }
    };
    

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-500';
            case 'canceled': return 'text-red-500';
            case 'pending': return 'text-blue-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <main className="admin-dashboard bg-[#E6F0FF] min-h-screen pt-4">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl mb-6 font-bold text-gray-900">Report Generate?</h1>

                <div className="flex flex-row justify-between gap-2">
                    <div className="filter-section bg-white p-6 rounded-lg shadow-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Filter by given duration</h2>
                        {dateRangeError && (
                            <div className="text-red-500 mb-2 text-end">
                                {dateRangeError}
                            </div>
                        )}
                        <div className="flex flex-row gap-4">
                            <input
                                required
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-4 py-2 border rounded-lg flex-1"
                                placeholder="Start Date"
                            />
                            <input
                                required
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-4 py-2 border rounded-lg flex-1"
                                placeholder="End Date"
                            />
                        </div>
                        <div className="flex flex-row actions mt-6 space-x-6">
                            <Button onClick={handleViewPatientHistory}>View Patient Treatment History</Button>
                            <Button onClick={handleViewAllPatientTreatments}>View All Patient Treatments</Button>
                            <Button onClick={handleViewDoctorWork}>View Doctor Work</Button>
                        </div>
                    </div>

                    <div className="filter-section bg-white p-6 rounded-lg shadow-lg mb-6 flex flex-col justify-between">
                        <div className="flex flex-col ">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Filter by Staff ID</h2>
                        <input
                                type="text"
                                value={staffId}
                                onChange={(e) => setStaffId(e.target.value)}
                                className="px-4 py-2 border rounded-lg flex-1"
                                placeholder="Staff ID"
                            />
                        </div>

                        
                        <div className="w-full">
                            <Button onClick={handleViewJobChangeHistory}>View Job Change History</Button>
                        </div>
                    </div>
                </div>

                {errorMessage && (
                    <div className="text-red-500 mb-6 text-center">
                        {errorMessage}
                    </div>
                )}

                {dataFetched.patientTreatmentHistory && patientTreatmentHistory.length === 0 && startDate && endDate && (
                    <div className="text-gray-500 mb-6 text-center">
                        No patient treatment history found for the selected date range.
                    </div>
                )}
                {dataFetched.allPatientTreatments && allPatientTreatments.length === 0 && startDate && endDate && (
                    <div className="text-gray-500 mb-6 text-center">
                        No treatments found for the selected date range.
                    </div>
                )}
                {dataFetched.doctorWork && doctorWork.length === 0 && startDate && endDate && (
                    <div className="text-gray-500 mb-6 text-center">
                        No work records found for the selected date range.
                    </div>
                )}
                {/*
                {dataFetched.jobChangeHistory && jobChangeHistory.length === 0 && staffId && (
                    <div className="text-gray-500 mb-6 text-center">
                    </div>
                )}
                */}
                

                {patientTreatmentHistory.length > 0 && (
                    <Table
                        columns={['ID', 'Date', 'Time', 'Doctor', 'Status']}
                        data={patientTreatmentHistory}
                    />
                )}
                {allPatientTreatments.length > 0 && (
                    <Table
                        columns={['ID', 'Date', 'Time', 'Patient', 'Treatment']}
                        data={allPatientTreatments}
                    />
                )}
                {doctorWork.length > 0 && (
                    <Table
                        columns={['Doctor ID', 'Patient ID', 'Treatment Date', 'Treatment ID']}
                        data={doctorWork}
                    />
                )}
                {jobChangeHistory.length > 0 && (
                    <Table
                        columns={['Staff ID', 'Change Date', 'Previous Role', 'New Role']}
                        data={jobChangeHistory}
                    />
                )}
            </div>
        </main>
    );
}
