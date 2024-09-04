"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IStaff } from '@/types/user';
import Link from 'next/link';
import { useUserContext } from "@/app/context";

export default function Staff() {

    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [staffList, setStaffList] = useState<IStaff[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<IStaff[]>([]);
    const [searchId, setSearchId] = useState<number>();
    const [departmentFilter, setDepartmentFilter] = useState<string>('');
    const [nameFilter, setNameFilter] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token  = localStorage.getItem('accessToken')
                const response = await axios.get('http://localhost:8080/staff',{
                    headers : {
                       Authorization : `Bearer ${token}` 
                    }
                });
                console.log(response);
                setStaffList(response.data);
                setFilteredStaff(response.data);
                // success message
                setSuccessMessage('Staff data loaded successfully.');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000);
            } catch (error) {
                console.error("Error fetching data:", error);
                setErrorMessage('Failed to load staff data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);



    useEffect(() => {
        let filteredList = staffList;

        if (searchId) {
            filteredList = filteredList.filter(s => s.s_id === searchId);
        }

        if (departmentFilter) {
            filteredList = filteredList.filter(s => s.departments.dept_name === departmentFilter);
        }

        if (nameFilter) {
            filteredList = filteredList.filter(s =>
                s.lastName.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }

        setFilteredStaff(filteredList);
    }, [searchId, departmentFilter, nameFilter, staffList]);

    const handleDeleteStaff = (id: number) => {
        setStaffList(staffList.filter(s => s.s_id !== id));
        setFilteredStaff(filteredStaff.filter(s => s.s_id !== id));
        setSuccessMessage(`Staff with ID ${id} deleted successfully.`);
    };

    const handleUpdateStaff = (id: number, updatedData: Partial<IStaff>) => {
        setStaffList(staffList.map(s => (s.s_id === id ? { ...s, ...updatedData } : s)));
        setFilteredStaff(filteredStaff.map(s => (s.s_id === id ? { ...s, ...updatedData } : s)));
        setSuccessMessage(`Staff with ID ${id} updated successfully.`);
    };

    return (
        <main className="staff bg-[#E6F0FF] min-h-screen pt-4">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl mb-6 font-bold text-gray-900">Staff Database Management</h1>
                <div className="flex flex-row justify-between">
                    <div className="search-field">
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(parseInt(e.target.value))}
                            placeholder="Search staff by ID"
                            className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] mb-4"
                        />
                    </div>

                    <div className="filter-field flex flex-row space-x-3">
                        <div className="filter-by-name">
                            <input
                                type="text"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                placeholder="Filter by name"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] mb-4"
                            />
                        </div>
                        <div className="filter-by-dept">
                            <input
                                type="text"
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                placeholder="Filter by department"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] mb-4"
                            />
                        </div>
                    </div>
                    <div className="add-staff-field">
                        <Link href="/admin/addstaff">
                            <button className="h-[50px] bg-[#1F2B6C] text-white py-2 px-4 rounded-md hover:shadow-lg">
                                Add New Staff
                            </button>
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <span className="text-gray-700">Loading staff...</span>
                    </div>
                ) : (
                    <div className='staff-database-container bg-white rounded-lg shadow-lg mb-6 overflow-y-auto'>
                        <table className="w-full text-left">
                            <thead className="bg-[#1F2B6C] text-white">
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">Job</th>
                                    <th className="py-2 px-4 border-b">Email</th>
                                    <th className="py-2 px-4 border-b">Department</th>
                                    <th className="py-2 px-4 border-b">Qualification</th>
                                    <th className="py-2 px-4 border-b">Salary</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.length > 0 ? (
                                    filteredStaff.map((staff) => (
                                        <tr key={staff.s_id}>
                                            <td className="text-black py-2 px-4 border-b">{staff.s_id}</td>
                                            <td className="text-black py-2 px-4 border-b">{staff.users.Fname} {staff.users.Lname}</td>
                                            <td className="text-black py-2 px-4 border-b">{staff.jobs.job_id}</td>
                                            <td className="text-black py-2 px-4 border-b">{staff.users.email}</td>
                                            <td className="text-black py-2 px-4 border-b">{staff.departments.dept_name}</td>
                                            <td className="text-black py-2 px-4 border-b">{staff.qualifications}</td>
                                            <td className="text-black py-2 px-4 border-b">{staff.salary}</td>
                                            <td className="text-black py-2 px-4 border-b">
                                                <div className='flex flex-row'>
                                                    <button onClick={() => handleUpdateStaff(staff.s_id, { departments: "Updated Department" })} className="bg-blue-600 text-white py-2 px-4 rounded-md mt-2 mr-2">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteStaff(staff.s_id)} className="bg-red-600 text-white py-2 px-4 rounded-md mt-2">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-2 px-4 text-center text-gray-500">
                                            No staff found.
                                        </td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
