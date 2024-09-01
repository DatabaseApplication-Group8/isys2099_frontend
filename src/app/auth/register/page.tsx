"use client";
import { useState } from 'react';
import Header from '@/components/Header/Header';
import { registerAccount } from '@/api/register.api';
import { IRegisterProps } from '@/types/user';
import axios from "axios";


export default function Register() {
    const [formData, setFormData] = useState<IRegisterProps>({
        username: "",
        firstName: "",
        mInit: "",
        lastName: "",
        phone: "",
        day: "",
        month: "",
        year: "",
        dob: "",
        sex: "",
        email: "",
        address: "",
        allergies: "",
        password: "",
        passwordConfirm: "",
    });

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        // Validate the form
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/users", {
                username: formData.username,
                pw: formData.password,
                Fname: formData.firstName,
                Minit: formData.mInit,
                Lname: formData.lastName,
                phone: formData.phone,
                email: formData.email,
                sex: formData.sex,
                birth_date: new Date(`${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`),
                roles: 3,
                address: formData.address,
                allergies: formData.allergies,
            });

            setSuccessMessage('You have successfully registered an account!');

            setTimeout(() => {
                setSuccessMessage(''); 
                window.location.href = "/auth/login";
            }, 5000);

        } catch (error: any) {
            setError(error.response.data.message || "An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => {
            const updatedFormData = { ...prevFormData, [id]: value };
            // Update dob when day, month, or year changes
            if (id === "day" || id === "month" || id === "year") {
                const day = updatedFormData.day || "01";
                const month = updatedFormData.month || "01";
                const year = updatedFormData.year || "1970";
                if (day && month && year) {
                    updatedFormData.dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
                }
            }
            return updatedFormData;
        });
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
        if (formData.password !== formData.passwordConfirm) {
            errors.push("Passwords do not match.");
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
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="username" className="text-sm font-semibold text-[#1F2B6C]">Username</label>
                            <input
                                required
                                type="text"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="firstName" className="text-sm font-semibold text-[#1F2B6C]">First Name</label>
                            <input
                                required
                                type="text"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter your first name"
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
                                placeholder="Enter your middle name"
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
                                placeholder="Enter your last name"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="sex" className="text-sm font-semibold text-[#1F2B6C]">Sex</label>
                            <div className='relative'>
                                <select
                                    required
                                    id="sex"
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className="p-3 appearance-none w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                                >
                                    <option value="" disabled>Select your sex</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"> {/* Adjusted positioning */}
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col space-y-2">
                            <label htmlFor="day" className="text-sm font-semibold text-[#1F2B6C]">
                                Date of Birth
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                <div className='relative'>
                                    <select
                                        id="day"
                                        value={formData.day}
                                        onChange={handleChange}
                                        className="w-full appearance-none p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                                    >
                                        <option value="">Day</option>
                                        {days.map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"> {/* Adjusted positioning */}
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>


                                <div className='relative'>
                                    <select
                                        id="month"
                                        value={formData.month}
                                        onChange={handleChange}
                                        className="w-full appearance-none p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                                    >
                                        <option value="">Month</option>
                                        {months.map((month) => (
                                            <option key={month} value={month}>
                                                {month}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"> {/* Adjusted positioning */}
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>


                                <div className='relative'>
                                    <select
                                        id="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="w-full appearance-none p-3 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                                    >
                                        <option value="">Year</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"> {/* Adjusted positioning */}
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>


                            </div>
                        </div>


                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="email" className="text-sm font-semibold text-[#1F2B6C]">Email</label>
                            <input
                                required
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
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
                                maxLength={10}
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="address" className="text-sm font-semibold text-[#1F2B6C]">Address</label>
                            <input

                                type="text"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="allergies" className="text-sm font-semibold text-[#1F2B6C]">Allergies</label>
                            <input

                                type="text"
                                id="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                placeholder="Enter your allergies"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className="flex flex-col space-y-2 relative">
                            <label htmlFor="password" className="text-sm font-semibold text-[#1F2B6C]">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] pr-12" // Added pr-12 to provide space for the icon
                                />
                                <div
                                    onClick={handleShowPassword}
                                    className="absolute inset-y-0 right-[1rem] flex items-center cursor-pointer"
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M19.48 19.48C17.6152 20.9015 15.3445 21.6889 13 21.7273C5.36364 21.7273 1 13 1 13C2.35697 10.4712 4.23906 8.26176 6.52 6.52001M10.7091 4.53455C11.46 4.35878 12.2288 4.27092 13 4.27273C20.6364 4.27273 25 13 25 13C24.3378 14.2388 23.5481 15.4052 22.6436 16.48M15.3127 15.3127C15.0131 15.6343 14.6518 15.8922 14.2503 16.071C13.8489 16.2499 13.4155 16.3461 12.9761 16.3539C12.5367 16.3616 12.1002 16.2808 11.6927 16.1162C11.2852 15.9516 10.915 15.7066 10.6042 15.3958C10.2934 15.085 10.0484 14.7149 9.88383 14.3073C9.71923 13.8998 9.63839 13.4633 9.64615 13.0239C9.6539 12.5845 9.75008 12.1511 9.92896 11.7497C10.1078 11.3482 10.3657 10.9869 10.6873 10.6873"
                                                stroke="black"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M1 1L25 25"
                                                stroke="black"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M1 9.72727C1 9.72727 5.36364 1 13 1C20.6364 1 25 9.72727 25 9.72727C25 9.72727 20.6364 18.4545 13 18.4545C5.36364 18.4545 1 9.72727 1 9.72727Z"
                                                stroke="black"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M12.9998 13C14.8073 13 16.2725 11.5348 16.2725 9.72732C16.2725 7.91984 14.8073 6.45459 12.9998 6.45459C11.1923 6.45459 9.72705 7.91984 9.72705 9.72732C9.72705 11.5348 11.1923 13 12.9998 13Z"
                                                stroke="black"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2 relative">
                            <label htmlFor="passwordConfirm" className="text-sm font-semibold text-[#1F2B6C]">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    required
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="passwordConfirm"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] pr-12" // Added pr-12 to provide space for the icon
                                />
                                <div
                                    onClick={handleShowConfirmPassword}
                                    className="absolute inset-y-0 right-[1rem] flex items-center cursor-pointer"
                                >
                                    {showConfirmPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M19.48 19.48C17.6152 20.9015 15.3445 21.6889 13 21.7273C5.36364 21.7273 1 13 1 13C2.35697 10.4712 4.23906 8.26176 6.52 6.52001M10.7091 4.53455C11.46 4.35878 12.2288 4.27092 13 4.27273C20.6364 4.27273 25 13 25 13C24.3378 14.2388 23.5481 15.4052 22.6436 16.48M15.3127 15.3127C15.0131 15.6343 14.6518 15.8922 14.2503 16.071C13.8489 16.2499 13.4155 16.3461 12.9761 16.3539C12.5367 16.3616 12.1002 16.2808 11.6927 16.1162C11.2852 15.9516 10.915 15.7066 10.6042 15.3958C10.2934 15.085 10.0484 14.7149 9.88383 14.3073C9.71923 13.8998 9.63839 13.4633 9.64615 13.0239C9.6539 12.5845 9.75008 12.1511 9.92896 11.7497C10.1078 11.3482 10.3657 10.9869 10.6873 10.6873"
                                                stroke="black"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M1 1L25 25"
                                                stroke="black"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M1 9.72727C1 9.72727 5.36364 1 13 1C20.6364 1 25 9.72727 25 9.72727C25 9.72727 20.6364 18.4545 13 18.4545C5.36364 18.4545 1 9.72727 1 9.72727Z"
                                                stroke="black"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M12.9998 13C14.8073 13 16.2725 11.5348 16.2725 9.72732C16.2725 7.91984 14.8073 6.45459 12.9998 6.45459C11.1923 6.45459 9.72705 7.91984 9.72705 9.72732C9.72705 11.5348 11.1923 13 12.9998 13Z"
                                                stroke="black"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {successMessage && (
                            <div
                                className="col-span-2 flex justify-center p-4 border border-green-500 rounded text-green-700 bg-green-100"
                                dangerouslySetInnerHTML={{ __html: successMessage }}
                            />
                        )}

                        {error && <div className="col-span-2 text-red-500 text-sm text-center">{error}</div>}

                        <div className="col-span-2 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="h-[45px] w-full border border-[#C5DCFF] rounded-md
                                            bg-[#1F2B6C] text-white
                                            hover:bg-[#1D3F7F] hover:shadow-lg 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500"

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