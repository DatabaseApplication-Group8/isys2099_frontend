
import Link from 'next/link';
import React from 'react';


const PatientHeader: React.FC  = () => {
  return (
    <header className="header w-full h-16 bg-[#1F2B6C] text-white flex justify-between items-center px-8 shadow-lg">
            <div className="logo text-2xl font-bold">
                <Link href="/">Group8</Link>
            </div>
            <nav className="login-nav">
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
        </header>
  )
}

export default PatientHeader