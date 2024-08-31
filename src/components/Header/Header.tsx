"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';


const Header: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    
    // Mock function to check user authentication status
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Replace with your API endpoint and logic
                const response = await fetch('/api/check-auth');
                const data = await response.json();
                
                // Check if user is authenticated
                if (data.isAuthenticated) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Failed to check authentication status:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <header className="header w-full h-16 bg-[#1F2B6C] text-white flex justify-between items-center px-8 shadow-lg">
            <div className="logo text-2xl font-bold">
                <Link href="/">Group8</Link>
            </div>

            {isAuthenticated ? (
                <nav className="staff-patient-nav">
                <ul className='flex space-x-8'>
                    <li>
                        <Link href="/" className="text-[#BFD2F8] hover:text-[#FCFEFE]">Home</Link>
                    </li>
                    <li>
                        <Link href="/appointment" className="text-[#BFD2F8] hover:text-[#FCFEFE]">Appointment</Link>
                    </li>
                    <li>
                        <Link href="/treatment" className="text-[#BFD2F8] hover:text-[#FCFEFE]">Treatment</Link>
                    </li>
                </ul>
            </nav>
            ):(
                <>
                    <nav className="auth-nav">
                        <ul className="flex space-x-6">
                            <Link href='/auth/login'>
                                <button
                                    className="h-[45px] w-[123px] mr-2 flex border-solid border-[3px] border-[#C5DCFF] rounded-[50px] 
                                            text-[#1F2B6C] bg-white items-center justify-center
                                            hover:bg-gray-200 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Log In"
                                >
                                    Log In
                                </button>
                            </Link>

                            <Link href='/auth/register'>
                                <button
                                    className="h-[45px] w-[123px] mr-2 flex rounded-[50px] 
                                            text-[#1F2B6C]  bg-[#BFD2F8] items-center justify-center
                                            hover:bg-gray-200 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Register"
                                >
                                    Register
                                </button>
                            </Link>
                        </ul>
                    </nav>
                    <nav className="hidden profile">
                        <ul className="flex space-x-6">
                            <Link href='/profile' className='text-[#BFD2F8] hover:text-[#FCFEFE]'>Profile</Link>
                        </ul>
                    </nav>
                </>
            )}


        </header>
    );
}

export default Header;
