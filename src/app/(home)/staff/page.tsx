"use client";
import { useState, useEffect } from "react";
import { useUserContext } from "@/app/context";
import axios from 'axios';
import { IUsers, Staff, updateStaffDto } from "@/types/user";
import { set } from "react-datepicker/dist/date_utils";

export default function Profile() {
  const { user, setUser } = useUserContext();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [userId, setId] = useState<number>(0);
  const [role, setRole] = useState<number>(0);
  const [today, setToday] = useState<string>("");
  const [updatedDataFE, setUpdatedDataFE] = useState<updateStaffDto | null>(null);
  const [updated, setUpdated] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    lastName: '',
    mInit: '',
    firstName: '',
    dob: '',
    email: '',
    phone: '',
    qualifications: '',
    salary: 0
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    setToday(todayDate);

    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      const id = localStorage.getItem("id");
      const role = localStorage.getItem("role");
      setId(Number(id));
      setRole(Number(role));

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

        const dob = response.data.users.birth_date ? formatDate(response.data.users.birth_date) : '';

        setFormData({
          lastName: response.data.users.Lname || '',
          mInit: response.data.users.Minit || '',
          firstName: response.data.users.Fname || '',
          dob: dob,
          email: response.data.users.email || '',
          phone: response.data.users.phone || '',
          qualifications: response.data.qualifications || '',
          salary: response.data.salary
        });
        console.log(response.data);
        setSuccessMessage('Staff data loaded successfully.');

        setTimeout(() => setSuccessMessage(''), 5000);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to fetch staff data.');
      } finally {
        setLoading(false);
        setUpdated(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('id');
    // Redirect to login page or perform other logout actions
  };

  const handleUpdateClick = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors).join(" "));
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!staff) return;

    if (!validateForm()) return; // Validate before submission

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const { salary, ...updatedData } = formData;
      const updatedStaff = { ...staff, ...updatedData };
      console.log(userId,role);
      console.log(updatedStaff);
      setUpdatedDataFE(updatedStaff);
      await axios.patch(`http://localhost:8080/users/update-staff/${encodeURIComponent(userId)}/${encodeURIComponent(role)}`, {
        Fname: updatedStaff.firstName,
        Minit: updatedStaff.mInit,
        Lname: updatedStaff.lastName,
        birth_date: new Date(updatedStaff.dob),
        phone: updatedStaff.phone,
        // email: updatedStaff.users.email,
        // salary: updatedStaff.salary,
        qualifications: updatedStaff.qualifications
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUpdated(true)
      console.log("Updated: ", updated); 
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => setSuccessMessage(''), 5000);
      // Optionally reset formData or staff state here if needed
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
        <div className="lg:w-1/3 mt-1">
          <h2 className="text-3xl font-semibold flex flex-col space-y-2 text-gray-900">Staff Personal Profile</h2>
          <div className="mt-4 bg-white p-6 rounded-lg shadow-lg">
            {staff ? (
              <>
                <p className="text-gray-700 text-lg">
                  <strong>Username:</strong> {staff.users.username}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Last Name:</strong> {updated ? updatedDataFE?.lastName :staff.users.Lname}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Middle Name:</strong> {updated ? updatedDataFE?.mInit : staff.users.Minit}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>First Name:</strong> {updated ? updatedDataFE?.firstName :staff.users.Fname}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Date of Birth:</strong> {updated? formatDate(updatedDataFE?.dob ?? '') : (staff.users.birth_date ? formatDate(staff.users.birth_date) : 'N/A')}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Role:</strong> {staff.users.role === 3
                    ? " Patient"
                    : staff.users.role === 2
                      ? " Staff"
                      : staff.users.role === 1
                        ? " Admin"
                        : "Unknown Role"}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Email:</strong> {staff.users.email}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Phone:</strong> {updated ? updatedDataFE?.phone : staff.users.phone}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Salary:</strong> {staff.salary}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong>Qualifications:</strong> {updated ? updatedDataFE?.qualifications : staff.qualifications}
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

        {showUpdateForm && (
          <div className="lg:w-2/3 mt-1">
            <h2 className="text-3xl font-semibold flex flex-col space-y-2 text-gray-900">Update Staff Profile</h2>
            <div className="mt-4 bg-[#BFD2F8] p-6 rounded-lg shadow-lg">
              <form className="container-content grid grid-cols-2 gap-4" onSubmit={handleFormSubmit}>
                <div>
                  <label className="block text-gray-700">Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="text-black w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Middle Name:</label>
                  <input
                    type="text"
                    name="mInit"
                    value={formData.mInit}
                    onChange={handleInputChange}
                    className="text-black w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="text-black w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Date of Birth:</label>
                  <input
                    type="date"
                    name="dob"
                    max={today}
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="text-black w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="text-black w-full p-2 border border-gray-300 rounded"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="text-black w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Qualifications:</label>
                  <input
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    className="text-black w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Salary:</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="text-black w-full p-2 border border-gray-300 rounded"
                    readOnly
                  />
                </div>
                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
                <div className="col-span-2 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateForm(false)}
                    className="h-11 w-[130px] border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-11 w-[135px] rounded-full text-white bg-[#1F2B6C] flex items-center justify-center hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save Changes
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
