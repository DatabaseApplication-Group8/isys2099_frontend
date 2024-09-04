"use client";
import { useState, useEffect } from "react";
import { useUserContext } from "@/app/context";
import axios from 'axios';

type Staff = {
  s_id: string;
  firstName: string;
  mInit: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  qualifications: string;
  username: string;
  role: string;
  salary: string; 
};

export default function Profile() {
  const { user } = useUserContext();
  const [staff, setStaff] = useState<Staff | null>(null); // Initialize as null
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8080/staff?id=${user.id}`, { // Correct URL
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('API Response Data:', response.data);

        const currentUserStaff = response.data.find((staff: Staff) => staff.s_id === user.id);
        console.log('Current User ID:', user.id);
        console.log('Filtered Staff Data:', currentUserStaff);

        if (currentUserStaff) {
          console.log('Setting Staff state with:', currentUserStaff);
          setStaff(currentUserStaff);
        } else {
          setErrorMessage('Staff data not found.');
        }

        setSuccessMessage('Staff data loaded successfully.');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to load staff data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  useEffect(() => {
    console.log('Staff state updated:', staff);
  }, [staff]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p className="text-red-500">{errorMessage}</p>;
  }

  if (!staff) {
    return <p>No staff data available.</p>;
  }
  return (
    <main className="profile min-h-screen bg-[#E6F0FF] py-8">
      <div className="container mx-auto flex flex-col space-y-2 lg:px-8 lg:flex-row gap-10">
        {/* Personal Profile Section */}
        <div className="lg:w-1/3 mt-1">
          <h2 className="text-3xl font-semibold flex flex-col space-y-2 text-gray-900">Staff Personal Profile</h2>
          <div className="mt-4 bg-white p-6 rounded-lg shadow-lg">
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
              <strong>Date of Birth:</strong> {staff.dob}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Role:</strong> {staff.role === 3
                ? " - Patient"
                : staff.role === 2
                ? " - Staff"
                : staff.role === 1
                ? " - Admin"
                : "Unknown Role"}
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
              <strong>Qualifications:</strong> {staff.qualifications}
            </p>
          </div>
          <div className="flex justify-end flex-row mt-4 space-x-4">
            <button
              onClick={handleUpdateClick}
              className="h-11 w-[135px] rounded-full text-white bg-[#1F2B6C] flex items-center justify-center
                              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Update Profile"
            >
              Update Profile
            </button>
            <button
              onClick={handleLogout}
              className="h-11 w-[130px] border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center
                              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Log Out"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Update Form Section */}
        {showUpdateForm && (
          <div className="lg:w-2/3 mt-1">
            <h2 className="text-3xl font-semibold flex flex-col space-y-2 text-gray-900">Update Staff Profile</h2>
            <div className="mt-4 bg-[#BFD2F8] p-6 rounded-lg shadow-lg">
              <form className="container-content grid grid-cols-2 gap-3" onSubmit={handleFormSubmit}>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-[#1F2B6C]">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    defaultValue={staff.lastName || ""}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="mInit" className="text-sm font-semibold text-[#1F2B6C]">Middle Name</label>
                  <input
                    type="text"
                    id="mInit"
                    name="mInit"
                    defaultValue={staff.mInit || ""}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="firstName" className="text-sm font-semibold text-[#1F2B6C]">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    defaultValue={staff.firstName || ""}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="dob" className="text-sm font-semibold text-[#1F2B6C]">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    defaultValue={staff.dob || ""}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#1F2B6C]">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={staff.email || ""}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-[#1F2B6C]">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={staff.phone || ""}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="address" className="text-sm font-semibold text-[#1F2B6C]">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    defaultValue={staff.address || ""}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="qualifications" className="text-sm font-semibold text-[#1F2B6C]">Qualifications</label>
                  <input
                    type="text"
                    id="qualifications"
                    name="qualifications"
                    defaultValue={staff.qualifications || ""}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="col-span-2 mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="h-11 w-[130px] rounded-full text-white bg-[#1F2B6C] flex items-center justify-center
                              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
              {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
              {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
