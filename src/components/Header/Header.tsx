"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useUserContext } from "@/app/context";

const Header: React.FC = () => {
    const { user } = useUserContext();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        if (user.username && user.role) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [user]);

    return (
        <header className="header w-full h-16 bg-[#1F2B6C] text-white flex items-center px-6 md:px-8 shadow-lg">
            <div className="logo text-2xl font-bold">
                <Link href="/">Group8</Link>
            </div>

            <nav className="flex flex-grow items-center space-x-6">
                {isAuthenticated ? (
                    <div className='flex w-full items-center'>
                        <div className="flex-grow flex justify-center space-x-12">
                            <Link href="/" className="text-[#BFD2F8] hover:text-[#FCFEFE]">Home</Link>
                            {user.role === 3 ? (
                                <>
                                    <Link href="/appointment" className="text-[#BFD2F8] hover:text-[#FCFEFE]">Appointment</Link>
                                    <Link href="/treatment" className="text-[#BFD2F8] hover:text-[#FCFEFE]">Treatment</Link>
                                </>
                            ) : user.role === 2 ? (
                                <>
                                    <Link href="/schedule" className="text-[#BFD2F8] hover:text-[#FCFEFE]">Schedule</Link>
                                </>
                            ) : null}
                        </div>
                        <div className="flex justify-end items-center space-x-4">
                            <Link href={user.role === 3 ? '/profile' : '/staff'} className='flex items-center text-[#BFD2F8] hover:text-[#FCFEFE]'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                {user.username}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className='flex w-full items-center justify-end'>
                        <div className="flex space-x-6">
                            <Link href='/auth/login'>
                                <button
                                    className="h-[45px] w-[123px] border border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Log In"
                                >
                                    Log In
                                </button>
                            </Link>
                            <Link href='/auth/register'>
                                <button
                                    className="h-[45px] w-[123px] rounded-full text-[#1F2B6C] bg-[#BFD2F8] flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Register"
                                >
                                    Register
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;
