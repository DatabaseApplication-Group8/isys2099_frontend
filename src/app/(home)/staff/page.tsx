"use client";
import Link from "next/link";
import { useStaffContext } from "@/app/context/staffcontext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const { staff, setStaff } = useStaffContext();

  const handleLogout = () => {
    localStorage.clear();
    setStaff({
        id: "",
        username: "",
        lastName: "",
        mInit: "",
        firstName: "",
        dob: "",
        role: "",
        email: "",
        phone: "",
        address: "",
        salary: 0,
        qualification: "",
    });
    window.location.href = "/";
  };

  return (
    <main className="profile min-h-screen bg-[#E6F0FF] py-8">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-10">
        {/* Personal Profile Section */}
        <div className="lg:w-1/3 mt-1">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">Staff Personal Profile</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-700 text-lg">
              <strong>Username:</strong> {staff.username}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Last Name:</strong> {staff.lastName}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Middle Name:</strong> {staff.mInit}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>First Name:</strong> {staff.firstName}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Dob:</strong> {staff.dob}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Role:</strong> {staff.role} - Staff
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Email:</strong> {staff.email}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Phone:</strong> {staff.phone}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Address:</strong> {staff.address}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Salary:</strong> {staff.salary}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Qualification:</strong> {staff.qualification}
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleLogout}
              className="h-11 w-32 border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center
                            hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Log Out"
            >
              Log Out
            </button>
          </div>
        </div>

      </div>

    </main>
  );
}
