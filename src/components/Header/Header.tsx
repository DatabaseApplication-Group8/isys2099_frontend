import Link from 'next/link';
import React from 'react';
import Authbutton from './authbutton/page';


const Header: React.FC = () => {
    return (
        <header className="header w-full h-16 bg-[#1F2B6C] text-white flex justify-between items-center px-8 shadow-lg">
            <div className="logo text-2xl font-bold">
                <Link href="/">Group8</Link>
            </div>

            <Authbutton />


            
        </header>
    );
}

export default Header;
