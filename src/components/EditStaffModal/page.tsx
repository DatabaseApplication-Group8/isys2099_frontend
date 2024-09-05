"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Department, Jobs, Staff } from "@/types/user"; // Updated import
import { useUserContext } from "@/app/context";

interface StaffType {
  id: string;
  username: string;
  firstName: string;
  mInit: string;
  lastName: string;
  phone: string;
  dob: string;
  sex: string;
  email: string;
  job: string;
  manager_id: string;
  qualification: string;
  salary: number;
  department: string;
}

interface EditStaffModalProps {
  staff: StaffType;
  onClose: () => void;
  onUpdate: (updatedData: StaffType) => void;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({ staff, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<StaffType>(staff);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [managerList, setManagerList] = useState<Staff[]>([]);
  const [jobList, setJobList] = useState<Jobs[]>([]);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    setToday(todayDate);

    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setErrorMessage("No access token found.");
          setLoading(false);
          return;
        }

        const user_id = parseInt(localStorage.getItem("id") ?? "", 10);

        // Fetch managers
        const responseAvailableManagers = await axios.get(
          `http://localhost:8080/staff/list-staff-exclude-current-user/${encodeURIComponent(user_id)}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        const dataManagers = responseAvailableManagers.data;
        setManagerList(dataManagers);

        // Fetch jobs
        const responseJobs = await axios.get(
            `http://localhost:8080/jobs`,{
              headers: {
                Authorization: `Bearer ${token}`, 
            }
        });
        setJobList(responseJobs.data);

        // Fetch departments
        const responseDepartment = await axios.get(
          `http://localhost:8080/department`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDepartmentList(responseDepartment.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage('Error fetching data.');
      }
    };

    fetchStaff();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:8080/staff/profile/${encodeURIComponent(formData.id)}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onUpdate(formData);
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage('Failed to update profile.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white m-10 p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Edit Staff Profile</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            {/* Updated grid layout */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Username 
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                readOnly
                placeholder="Enter username"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="firstName"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                First Name 
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="mInit"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Middle Name
              </label>
              <input
                type="text"
                id="mInit"
                name="mInit"
                value={formData.mInit}
                onChange={handleChange}
                placeholder="Enter middle name"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="lastName"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Last Name 
              </label>
              <input
  
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="sex"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Sex 
              </label>
              <div className="relative">
                <select
    
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="p-3 appearance-none w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                >
                  <option value="" disabled>
                    Select sex
                  </option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Phone 
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Email 
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="dob"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Date of Birth 
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                max={today}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="job"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Job 
              </label>
              <select
                id="job"
                name="job"
                value={formData.job}
                onChange={handleChange}
                className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              >
                <option value="" disabled>Select job</option>
                {jobList.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="department"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Department 
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              >
                <option value="" disabled>Select department</option>
                {departmentList.map((department) => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="manager"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Manager
              </label>
              <select
                id="manager"
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
                className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              >
                <option value="">None</option>
                {managerList.map((manager) => (
                  <option key={manager.id} value={manager.id}>{manager.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="qualification"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Qualification
              </label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Enter qualification"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="salary"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Salary
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;
