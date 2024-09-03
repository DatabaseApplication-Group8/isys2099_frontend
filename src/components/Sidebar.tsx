"use client";
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="flex flex-col w-full text-white h-screen">
            <div className="p-6 text-xl font-semibold">Admin Dashboard</div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    <li>
                        <Link href="/admin/staff" className="block py-3 px-4 hover:bg-[#BFD2F8] hover:text-black">
                            Staff Management
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/patient" className="block py-3 px-4 hover:bg-[#BFD2F8] hover:text-black">
                            Patient Management
                        </Link>
                    </li>
                    
                    <li>
                        <Link href="/admin/report" className="block py-3 px-4 hover:bg-[#BFD2F8] hover:text-black">
                            Report
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
