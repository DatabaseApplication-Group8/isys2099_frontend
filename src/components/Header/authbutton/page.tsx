"use client";
import Link from 'next/link';

export default function Authbutton() {
    return (
        <nav className="auth-nav">
                <ul className="flex space-x-6">
                    <Link href='/auth/login'>
                        <button
                            className="h-[45px] w-[123px] mr-2 flex border-solid border-[3px] border-[#C5DCFF] rounded-[50px] 
                                    text-[#1F2B6C] bg-white items-center justify-center
                                    hover:bg-gray-200 
                                    focus:outline-none focus:ring-2focus:ring-blue-500"
                        >
                            Log In
                        </button>
                    </Link>

                    <Link href='/auth/register'>
                        <button
                            className="h-[45px] w-[123px] mr-2 flex rounded-[50px] 
                                    text-[#1F2B6C]  bg-[#BFD2F8] items-center justify-center
                                    hover:bg-gray-200 
                                    focus:outline-none focus:ring-2focus:ring-blue-500"
                        >
                            Register
                        </button>
                    </Link>
                </ul>
            </nav>
    );
}







