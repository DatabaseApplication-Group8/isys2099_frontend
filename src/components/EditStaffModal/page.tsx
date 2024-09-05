"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Department, Jobs } from "@/types/user";
import { useUserContext } from "@/app/context";

interface Staff {
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
  staff: Staff;
  onClose: () => void;
  onUpdate: (updatedData: Staff) => void;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({ staff, onClose, onUpdate }) => {
  const { user, setUser } = useUserContext();
  const [formData, setFormData] = useState<Staff>(staff);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [managerList, setManagerList] = useState<Staff[]>([]);
  const [jobList, setJobList] = useState<Jobs[]>([]);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error("No access token found.");

        const user_id = formData.id; // Use appropriate user ID

        const [managersResponse, jobsResponse, departmentsResponse] = await Promise.all([
          axios.get<Staff[]>(`http://localhost:8080/staff/list-staff-exclude-current-user/${user_id}`, {
            headers:
              { Authorization: `Bearer ${token}` }
          }),

          axios.get<Jobs[]>(`http://localhost:8080/jobs`, {
            headers:
              { Authorization: `Bearer ${token}` }
          }),

          axios.get<Department[]>(`http://localhost:8080/department`, {
            headers:
              { Authorization: `Bearer ${token}` }
          })
        ]);

        setManagerList(managersResponse.data);
        setJobList(jobsResponse.data);
        setDepartmentList(departmentsResponse.data);
        setToday(new Date().toISOString().split("T")[0]);

      } catch (error) {
        console.error("Error fetching lists:", error);
        setErrorMessage('Failed to fetch data.');
      }
    };

    fetchLists();
  }, [formData.id]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error("No token found");

      await axios.put(
        `http://localhost:8080/staff/profile/${encodeURIComponent(formData.id)}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdate(formData);
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData(staff);
  }, [staff]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white m-10 p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Edit Staff Profile</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-[#1F2B6C]">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                readOnly
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="firstName" className="text-sm font-semibold text-[#1F2B6C]">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="mInit" className="text-sm font-semibold text-[#1F2B6C]">Middle Name</label>
              <input
                type="text"
                id="mInit"
                name="mInit"
                value={formData.mInit}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="lastName" className="text-sm font-semibold text-[#1F2B6C]">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="sex" className="text-sm font-semibold text-[#1F2B6C]">Sex</label>
              <div className="relative">
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="p-3 appearance-none w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                >
                  <option value="" disabled>Select sex</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="phone" className="text-sm font-semibold text-[#1F2B6C]">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-[#1F2B6C]">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="dob" className="text-sm font-semibold text-[#1F2B6C]">Date of Birth</label>
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
              <label htmlFor="job" className="text-sm font-semibold text-[#1F2B6C]">Job</label>
              <select
                id="job"
                name="job"
                value={formData.job}
                onChange={handleChange}
                className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              >
                <option value="">Select job</option>
                {jobList.map((job) => (
                  <option key={job.id} value={job.id}>{job.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="manager_id" className="text-sm font-semibold text-[#1F2B6C]">Manager</label>
              <select
                id="manager_id"
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
                className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              >
                <option value="">None</option>
                {managerList.map((manager) => (
                  <option key={manager.id} value={manager.id}>{manager.username}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="qualification" className="text-sm font-semibold text-[#1F2B6C]">Qualification</label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="salary" className="text-sm font-semibold text-[#1F2B6C]">Salary</label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="department" className="text-sm font-semibold text-[#1F2B6C]">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              >
                <option value="">Select department</option>
                {departmentList.map((department) => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-4">
            <button
              type="submit"
              className="h-11 w-[135px] rounded-full text-white bg-[#1F2B6C] flex items-center justify-center hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-11 w-32 border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;
