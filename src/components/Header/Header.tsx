import Link from 'next/link';
import React from 'react';


const Header: React.FC = () => {
    return (
        <header className="header w-full h-16 bg-[#1F2B6C] text-white flex justify-between items-center px-8 shadow-lg">
            <div className="logo text-2xl font-bold">
                <Link href="/">Group8</Link>
            </div>


            {/* Render when patient/staff successfully connection*/}
            <nav className="hidden staff-patient-nav">
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

            {/* Hidden when patient/staff successfully connection*/}
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

            {/* Appear when patient/staff successfully connection*/}
            <nav className="hidden profile">
                <ul className="flex space-x-6">
                    <Link href='/profile' className='text-[#BFD2F8] hover:text-[#FCFEFE]'>Profile</Link>
                </ul>
            </nav>


        </header>
    );
}

export default Header;
