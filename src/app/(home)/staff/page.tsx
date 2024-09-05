"use client";
import { useState, useEffect } from "react";
import { useUserContext } from "@/app/context";
import axios from 'axios';
import { Staff } from "@/types/user";

export default function Profile() {
  const { user, setUser } = useUserContext();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      const id = localStorage.getItem("id");

      if (!token || !id) {
        setErrorMessage("No authentication token or ID found.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/staff/profile/${encodeURIComponent(id)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStaff(response.data);
        console.log('Staff data:', response.data);
        console.log('Staff state:', staff);
        setSuccessMessage('Staff data loaded successfully.');
        setTimeout(() => setSuccessMessage(''), 5000);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to fetch staff data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('Staff state updated:', staff);
  }, [staff]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('id');
    // Redirect to login page or perform other logout actions
  };

  const handleUpdateClick = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!staff) return; // Prevent submission if staff is null

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("No authentication token found.");
      }

      // Gather form data here, for example:
      const updatedStaff = { ...staff }; // Replace with actual form data

      await axios.put('http://localhost:8080/staff/profile', updatedStaff, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return <p className="text-red-500">{errorMessage}</p>;
  }

  return (
    <main className="profile min-h-screen bg-[#E6F0FF] py-8">
      <div className="container mx-auto flex flex-col space-y-2 lg:px-8 lg:flex-row gap-10">
        {/* Personal Profile Section */}
        <div className="lg:w-1/3 mt-1">
          <h2 className="text-3xl font-semibold flex flex-col space-y-2 text-gray-900">Staff Personal Profile</h2>
          <div className="mt-4 bg-white p-6 rounded-lg shadow-lg">
            {staff ? (
              <>
                <p className="text-gray-700 text-lg">
                  <strong>Username:</strong> {staff.users.username}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Last Name:</strong> {staff.users.Lname}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Middle Name:</strong> {staff.users.Minit}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>First Name:</strong> {staff.users.Fname}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Date of Birth:</strong> {staff.users.birth_date}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Role:</strong> {staff.users.role === 3
                    ? " - Patient"
                    : staff.users.role === 2
                      ? " - Staff"
                      : staff.users.role === 1
                        ? " - Admin"
                        : "Unknown Role"}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Email:</strong> {staff.users.email}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Phone:</strong> {staff.users.phone}
                </p>
                {/* <p className="text-gray-700 text-lg">
                  <strong>Address:</strong> {staff.users}
                </p> */}
                <p className="text-gray-700 text-lg">
                  <strong>Salary:</strong> {staff.salary}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Qualifications:</strong> {staff.qualifications}
                </p>
              </>
            ) : (
              <p>No staff data available</p>
            )}
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
                {/* Form fields for updating staff details */}
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
