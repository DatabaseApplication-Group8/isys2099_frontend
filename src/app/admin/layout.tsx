"use client";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="grid grid-cols-12 min-h-screen">
            <div className="col-span-2 bg-[#1F2B6C]">
                <Sidebar />
            </div>
            <div className="col-span-10 bg-[#E6F0FF] p-6">
                {children}
            </div>
        </section>
    );
}
