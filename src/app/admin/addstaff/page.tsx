"use client";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { IStaff } from '@/types/user';


export default function AddStaff() {
    const [formData, setFormData] = useState<IStaff>({
        username: "",
        firstName: "",
        mInit: "",
        lastName: "",
        phone: "",
        dob: "",
        sex: "",
        email: "",
        password: "",
        department: "",
        salary: 0,
        qualification: ""
    });

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleAddStaff = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        // Validate the form
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/staff", {
                username: formData.username,
                pw: formData.password,
                Fname: formData.firstName,
                Minit: formData.mInit,
                Lname: formData.lastName,
                phone: formData.phone,
                email: formData.email,
                sex: formData.sex,
                birth_date: formData.dob,
                roles: 2,
                department: formData.department,
                salary: formData.salary,
                qualification: formData.qualification
            });

            setSuccessMessage('You have successfully created new staff!');

            setTimeout(() => {
                setSuccessMessage('');
                window.location.href = "/admin/staff";
            }, 5000);

        } catch (error: any) {
            setError(error.response.data.message || "An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value
        }));
    };

    const validatePassword = (password: string) => {
        const errors: string[] = [];
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number.");
        }
        if (!/[^\w\s]/.test(password)) {
            errors.push("Password must contain at least one special character.");
        }
        return errors;
    };

    const validateForm = () => {
        let errors: string[] = [];

        if (!formData.email.endsWith('@gmail.com')) {
            errors.push("Email must end with '@gmail.com'.");
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            errors.push("Phone number must be exactly 10 digits.");
        }
        if (!formData.email.includes("@")) {
            errors.push("Please enter a valid email.");
        }

        const passwordValidationErrors = validatePassword(formData.password);
        if (passwordValidationErrors.length > 0) {
            errors = [...errors, ...passwordValidationErrors];
        }

        if (errors.length > 0) {
            setError(errors.join(" "));
            return false;
        }

        setError("");
        return true;
    };

    return (
        <div className='min-h-screen flex justify-center'>
            <main className="flex flex-col flex-grow p-12 justify-center items-center">
                <div className="container p-12 max-w-4xl rounded-lg bg-[#BFD2F8] bg-opacity-[50%] shadow-lg">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-3xl font-bold text-[#1F2B6C]">Add New Staff</h1>
                    </div>
                    <form onSubmit={handleAddStaff} className="container-content grid grid-cols-4 gap-3">
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="username" className="text-sm font-semibold text-[#1F2B6C]">Username</label>
                            <input
                                required
                                type="text"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            /></div>


                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="firstName" className="text-sm font-semibold text-[#1F2B6C]">First Name</label>
                            <input
                                required
                                type="text"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="mInit" className="text-sm font-semibold text-[#1F2B6C]">Middle Name</label>
                            <input
                                type="text"
                                id="mInit"
                                value={formData.mInit}
                                onChange={handleChange}
                                placeholder="Enter middle name"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="lastName" className="text-sm font-semibold text-[#1F2B6C]">Last Name</label>
                            <input
                                required
                                type="text"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="sex" className="text-sm font-semibold text-[#1F2B6C]">Sex</label>
                            <div className='relative'>
                                <select
                                    required
                                    id="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className="p-3 appearance-none w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] w-full"
                                >
                                    <option value="" disabled>Select sex</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"> {/* Adjusted positioning */}
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="dob" className="text-sm font-semibold text-[#1F2B6C]">Date of Birth</label>
                            <input
                                required
                                type="date"
                                id="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="phone" className="text-sm font-semibold text-[#1F2B6C]">Phone Number</label>
                            <input
                                required
                                type="text"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="email" className="text-sm font-semibold text-[#1F2B6C]">Email</label>
                            <input
                                required
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="department" className="text-sm font-semibold text-[#1F2B6C]">Department</label>
                            <input
                                required
                                type="text"
                                id="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="Enter department"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="qualification" className="text-sm font-semibold text-[#1F2B6C]">Qualification</label>
                            <input
                                required
                                type="text"
                                id="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                placeholder="Enter qualification"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="salary" className="text-sm font-semibold text-[#1F2B6C]">Salary</label>
                            <input
                                required
                                type="number"
                                id="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="Enter salary"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="password" className="text-sm font-semibold text-[#1F2B6C]">Password</label>
                            <input
                                required
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>
                        <div className="col-span-4 flex items-center justify-center">
                            <button
                                type="submit"
                                className="bg-[#1F2B6C] text-white py-2 px-4 rounded-md w-full">
                                {loading ? "Submitting..." : "Add New Staff"}
                            </button>
                        </div>
                    </form>

                    {error && <p className="text-red-600 mt-4">{error}</p>}
                    {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
                </div>
            </main>
        </div>

    );

};