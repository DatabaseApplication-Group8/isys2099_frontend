// mockData.ts

export const mockPatientTreatmentHistory = [
    {
        id: '1',
        date: '2024-09-01',
        time: '09:00',
        doctor: 'Dr. Smith',
        status: 'completed'
    },
    {
        id: '2',
        date: '2024-09-02',
        time: '10:00',
        doctor: 'Dr. Johnson',
        status: 'pending'
    },
    // Add more mock data as needed
];

export const mockAllPatientTreatments = [
    {
        id: '3',
        date: '2024-09-01',
        time: '11:00',
        doctor: 'Dr. Lee',
        status: 'canceled'
    },
    {
        id: '4',
        date: '2024-09-03',
        time: '14:00',
        doctor: 'Dr. Brown',
        status: 'completed'
    },
    // Add more mock data as needed
];

export const mockJobChangeHistory = [
    {
        staffId: '1001',
        changeDate: '2024-08-15',
        previousRole: 'Nurse',
        newRole: 'Senior Nurse'
    },
    {
        staffId: '1002',
        changeDate: '2024-08-16',
        previousRole: 'Receptionist',
        newRole: 'Assistant Manager'
    },
    // Add more mock data as needed
];

export const mockDoctorWork = [
    {
        doctorId: 'D001',
        patientId: 'P001',
        treatmentDate: '2024-09-01',
        treatmentId: 'T001'
    },
    {
        doctorId: 'D002',
        patientId: 'P002',
        treatmentDate: '2024-09-02',
        treatmentId: 'T002'
    },
    // Add more mock data as needed
];


{/*
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
        className="bg-[#1F2B6C] text-white px-4 py-2 rounded-lg hover:bg-[#153C6B] transition-colors mr-4"
    >
        {children}
    </button>
);

const Table = ({ columns, data }: { columns: string[], data: any[] }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
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
    const [jobChangeHistoryErrorMessage, setJobChangeHistoryErrorMessage] = useState<string | null>(null);

    // Flag for using mock data
    const useMockData = true;

    // Validate date range
    const validateDateRange = () => {
        if (new Date(startDate) >= new Date(endDate)) {
            setDateRangeError('End date must be after start date.');
            return false;
        }
        setDateRangeError(null);
        return true;
    };

    // Fetch data function
    const fetchData = async (url: string, params: object, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        if (useMockData) {
            // Use mock data for testing
            if (url === '/api/patient-treatment-history') {
                setter(mockPatientTreatmentHistory);
            } else if (url === '/api/all-patient-treatments') {
                setter(mockAllPatientTreatments);
            } else if (url === '/api/doctor-work') {
                setter(mockDoctorWork);
            }
            setErrorMessage(null);
        } else {
            try {
                const response = await axios.get(url, { params });
                setter(response.data);
                setErrorMessage(null);
            } catch (error) {
                setErrorMessage(`Error fetching data from ${url}.`);
            }
        }
    };

    const handleViewPatientHistory = async () => {
        if (!validateDateRange()) return;
        await fetchData(`/api/patient-treatment-history`, { startDate, endDate }, setPatientTreatmentHistory);
    };

    const handleViewAllPatientTreatments = async () => {
        if (!validateDateRange()) return;
        await fetchData(`/api/all-patient-treatments`, { startDate, endDate }, setAllPatientTreatments);
    };

    const handleViewDoctorWork = async () => {
        if (!validateDateRange()) return;
        await fetchData(`/api/doctor-work`, { startDate, endDate }, setDoctorWork);
    };

    const handleViewJobChangeHistory = async () => {
        try {
            if (useMockData) {
                setJobChangeHistory(mockJobChangeHistory);
            } else {
                const response = await axios.get(`/api/job-change-history`, { params: { staffId } });
                setJobChangeHistory(response.data);
            }
            setJobChangeHistoryErrorMessage(null);
        } catch (error) {
            setJobChangeHistoryErrorMessage('Error fetching job change history.');
        }
    };

    return (
        <main className="admin-dashboard bg-[#E6F0FF] min-h-screen pt-4">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl mb-6 font-bold text-gray-900">Admin Dashboard</h1>

                <div className="filter-section bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Filter by Date Range</h2>
                    {dateRangeError && (
                        <div className="text-red-500 mb-2 text-end">
                            {dateRangeError}
                        </div>
                    )}
                    <div className="flex flex-col lg:flex-row gap-4">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg flex-1"
                            placeholder="Start Date"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg flex-1"
                            placeholder="End Date"
                        />
                    </div>
                    <div className="actions mt-6">
                        <Button onClick={handleViewPatientHistory}>View Patient History</Button>
                        <Button onClick={handleViewAllPatientTreatments}>View All Patient Treatments</Button>
                        <Button onClick={handleViewDoctorWork}>View Doctor Work</Button>
                        <Button onClick={handleViewJobChangeHistory}>View Job Change History</Button>
                    </div>
                </div>

                {errorMessage && (
                    <div className="text-red-500 mb-4">
                        {errorMessage}
                    </div>
                )}
                {jobChangeHistoryErrorMessage && (
                    <div className="text-red-500 mb-4">
                        {jobChangeHistoryErrorMessage}
                    </div>
                )}

                <div className="reports">
                    <h2 className="text-3xl mb-4 font-semibold text-gray-800">Reports</h2>

                    {patientTreatmentHistory.length > 0 && (
                        <Table
                            columns={['ID', 'Date', 'Time', 'Doctor', 'Status']}
                            data={patientTreatmentHistory}
                        />
                    )}

                    {allPatientTreatments.length > 0 && (
                        <Table
                            columns={['ID', 'Date', 'Time', 'Doctor', 'Status']}
                            data={allPatientTreatments}
                        />
                    )}

                    {jobChangeHistory.length > 0 && (
                        <Table
                            columns={['Staff ID', 'Change Date', 'Previous Role', 'New Role']}
                            data={jobChangeHistory}
                        />
                    )}

                    {doctorWork.length > 0 && (
                        <Table
                            columns={['Doctor ID', 'Patient ID', 'Treatment Date', 'Treatment ID']}
                            data={doctorWork}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
    
*/}