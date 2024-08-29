"use client";
import { useState } from 'react';
import Header from '@/components/Header/Header';
import { register } from '@/api/register.api';
import { IRegisterProps } from '@/types/user';


export default function Register() {
    const [signUpForm, setsignUpForm] = useState<IRegisterProps>({
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        day: '',
        month: '',
        year: '',
        sex: '',
        email: '',
        address: '',
        password: '',
        passwordConfirm: '',
    });

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Specify the type of the event parameter
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setsignUpForm({ ...signUpForm, [e.target.id]: e.target.value });
    };

    // Specify the type of the password parameter
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
        
        if (!signUpForm.email.endsWith('@gmail.com')) {
            errors.push("Email must end with '@gmail.com'.");
        }
        if (!/^\d{10}$/.test(signUpForm.phone)) {
            errors.push("Phone number must be exactly 10 digits.");
        }
        if (!signUpForm.email.includes("@")) {
            errors.push("Please enter a valid email.");
        }
        if (signUpForm.password !== signUpForm.passwordConfirm) {
            errors.push("Passwords do not match.");
        }
        const passwordValidationErrors = validatePassword(signUpForm.password);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate the form
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        // Combine day, month, and year into dob
        const dob = `${signUpForm.year}-${String(signUpForm.month).padStart(2, '0')}-${String(signUpForm.day).padStart(2, '0')}`;

        try {
            // Example register request (replace with actual API call)
            const response = await fetch('register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...signUpForm, dob }), // Include dob in request
            });

            if (response.ok) {
                // Handle successful registration (e.g., redirect to login page)
                window.location.href = '/auth/login';
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

    // Generate day, month, and year options
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

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
                                value={signUpForm.firstName}
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
                                value={signUpForm.middleName}
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
                                value={signUpForm.lastName}
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
                                value={signUpForm.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone"
                                maxLength={10}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label className="text-sm font-semibold text-[#1F2B6C]">Date of Birth</label>
                            <div className="grid grid-cols-3 gap-4">
                                <select
                                    required
                                    id="day"
                                    value={signUpForm.day}
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                                >
                                    <option value="" disabled>Day</option>
                                    {days.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                                <select
                                    required
                                    id="month"
                                    value={signUpForm.month}
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                                >
                                    <option value="" disabled>Month</option>
                                    {months.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    required
                                    id="year"
                                    value={signUpForm.year}
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                                >
                                    <option value="" disabled>Year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="sex" className="text-sm font-semibold text-[#1F2B6C]">Sex</label>
                            <select
                                required
                                id="sex"
                                value={signUpForm.sex}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            >
                                <option value="" disabled>Select your sex</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="email" className="text-sm font-semibold text-[#1F2B6C]">Email</label>
                            <input
                                required
                                type="email"
                                id="email"
                                value={signUpForm.email}
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
                                value={signUpForm.address}
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
                                value={signUpForm.password}
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
                                value={signUpForm.passwordConfirm}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className="col-span-2 flex justify-center">
                            <button
                                type="submit"
                                className={`p-3 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-[#1F2B6C] hover:bg-[#1F2B6C]'} transition duration-300`}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
