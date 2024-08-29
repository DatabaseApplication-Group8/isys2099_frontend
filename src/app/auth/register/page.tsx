"use client";
import { useState } from 'react';
import Header from '@/components/Header/Header';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        dob: '',
        sex: '', // Keep as empty string to handle no selection case
        email: '',
        address: '',
        password: '',
        passwordConfirm: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (formData.password !== formData.passwordConfirm) {
            setError("Passwords don't match.");
            setLoading(false);
            return;
        }

        try {
            // Example register request (replace with actual API call)
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Handle successful registration (e.g., redirect to login page)
                window.location.href = '/login';
            } else {
                const result = await response.json();
                setError(result.message || 'An error occurred. Please try again later.');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register min-h-screen flex flex-col bg-[#F5F8FF]">
            <Header />
            <main className="flex flex-col flex-grow bg-white p-12 justify-center items-center">
                <div className="container p-12 max-w-4xl rounded-lg bg-[#BFD2F8] bg-opacity-[50%] shadow-lg">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-3xl font-bold text-[#1F2B6C]">Register an account</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="container-content grid grid-cols-1 md:grid-cols-2 gap-6">
                        {error && <div className="col-span-2 text-red-500 text-sm text-center">{error}</div>}
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="firstName" className="text-sm font-semibold text-[#1F2B6C]">First Name</label>
                            <input
                                required
                                type="text"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="middleName" className="text-sm font-semibold text-[#1F2B6C]">Middle Name</label>
                            <input
                                required
                                type="text"
                                id="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                placeholder="Enter your middle name"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
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
                                placeholder="Enter your last name"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="phone" className="text-sm font-semibold text-[#1F2B6C]">Phone</label>
                            <input
                                required
                                type="text"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="dob" className="text-sm font-semibold text-[#1F2B6C]">Date of Birth</label>
                            <input
                                required
                                type="text"
                                id="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                placeholder="Date of Birth"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="sex" className="text-sm font-semibold text-[#1F2B6C]">Sex</label>
                            <select
                                required
                                id="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            >
                                <option value="" disabled>Select your gender</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                            </select>
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="email" className="text-sm font-semibold text-[#1F2B6C]">Email</label>
                            <input
                                required
                                type="text"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="address" className="text-sm font-semibold text-[#1F2B6C]">Address</label>
                            <input
                                required
                                type="text"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
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
                                placeholder="Enter your password"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="passwordConfirm" className="text-sm font-semibold text-[#1F2B6C]">Confirm Password</label>
                            <input
                                required
                                type="password"
                                id="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>
                    </form>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="h-[45px] w-full md:w-auto px-6 py-2 border-solid border-[3px] border-[#C5DCFF]
                                text-[#1F2B6C] bg-white rounded-md hover:bg-[#1F2B6C] hover:text-white hover:border-0
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
