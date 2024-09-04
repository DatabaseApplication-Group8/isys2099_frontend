"use client";
import { useState, useEffect } from "react";
import axios from 'axios';

export default function Profile() {
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  // Flag to toggle between mock data and real data
  const useMockData = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (useMockData) {
          // Mock data
          const mockStaffData = {
            username: "john_doe",
            lastName: "Doe",
            mInit: "A",
            firstName: "John",
            dob: "1990-01-01",
            role: "2",
            email: "john.doe@example.com",
            phone: "123-456-7890",
            address: "123 Main St, Anytown, USA",
            salary: "$50,000",
            qualification: "B.Sc. Computer Science",
          };
          setStaff(mockStaffData);
          setSuccessMessage('Staff data loaded successfully.');
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        } else {
          const token = localStorage.getItem('accessToken');
          const response = await axios.get('http://localhost:8080/staff', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setStaff(response.data);  // Update staff data
          setSuccessMessage('Staff data loaded successfully.');
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage('Failed to load staff data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateClick = () => {
    setShowUpdateForm(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';  // Redirect to login page
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData(event.currentTarget);
      const updatedData = {
        lastName: formData.get('lastName'),
        mInit: formData.get('mInit'),
        firstName: formData.get('firstName'),
        dob: formData.get('dob'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        qualification: formData.get('qualification'),
      };
      await axios.put('http://localhost:8080/staff', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      setShowUpdateForm(false); // Hide form after submission
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage('Failed to update profile.');
    }
  };

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
              <strong>Middle Initial:</strong> {staff.mInit}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>First Name:</strong> {staff.firstName}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Date of Birth:</strong> {staff.dob}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Role:</strong> {staff.role === "2" ? "Staff" : "Unknown"}
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
          <div className="flex justify-end flex-row mt-4 space-x-4">
            <button
              onClick={handleUpdateClick}
              className="h-11 w-32 border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center
                            hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Update Profile"
            >
              Update Profile
            </button>
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

        {/* Update Form Section */}
        {showUpdateForm && (
          <div className="lg:w-2/3 mt-1 ">
            <h2 className="text-3xl font-semibold flex flex-col space-y-2 text-gray-900">Update Staff Profile</h2>
            <div className="mt-4 bg-[#BFD2F8] p-6 rounded-lg shadow-lg">
              <form className="container-content grid grid-cols-3 gap-3" onSubmit={handleFormSubmit}>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-[#1F2B6C]">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    defaultValue={staff.lastName}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="mInit" className="text-sm font-semibold text-[#1F2B6C]">Middle Name</label>
                  <input
                    type="text"
                    id="mInit"
                    name="mInit"
                    defaultValue={staff.mInit}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="firstName" className="text-sm font-semibold text-[#1F2B6C]">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    defaultValue={staff.firstName}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="dob" className="text-sm font-semibold text-[#1F2B6C]">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    defaultValue={staff.dob}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#1F2B6C]">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={staff.email}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-[#1F2B6C]">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={staff.phone}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="address" className="text-sm font-semibold text-[#1F2B6C]">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    defaultValue={staff.address}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="job" className="text-sm font-semibold text-[#1F2B6C]">Job</label>
                  <input
                    type="text"
                    id="job"
                    name="job"
                    defaultValue={staff.job_title}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="qualification" className="text-sm font-semibold text-[#1F2B6C]">Qualification</label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    defaultValue={staff.qualification}
                    className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                  />
                </div>
                <div className="flex justify-end flex-row mt-4 col-span-2 space-x-4">
                  <button
                    type="submit"
                    className="h-11 w-32 border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center
                                  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Save Changes"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUpdateForm(false)}
                    className="h-11 w-32 border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center
                                  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
