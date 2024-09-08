"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Department, IStaff, Jobs, Staff, updatedStaff, updateStaffDto } from "@/types/user";
import { useUserContext } from "@/app/context";
import { start } from "repl";

// interface Staff {
//   id: string;
//   username: string;
//   firstName: string;
//   mInit: string;
//   lastName: string;
//   phone: string;
//   dob: string;
//   sex: string;
//   email: string;
//   job: string;
//   manager_id: string;
//   qualification: string;
//   salary: number;
//   departments: string;
// }


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
  const [userId, setUserId] = useState<number>(0);
  const [role, setRole] = useState<number>(0);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const user_id = localStorage.getItem('id');
        const role = localStorage.getItem('role');
        setUserId(Number(user_id));
        setRole(Number(role));
        if (!token) throw new Error("No access token found.");

        // const user_id = formData.id; // Use appropriate user ID

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
        console.log("Managers: ", managersResponse.data);
        console.log("Jobs: ", jobsResponse.data);
        console.log("Departments: ", departmentsResponse.data);

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
  }, [formData.s_id]);



  useEffect(() => {
    // Convert the date to YYYY-MM-DD format
    if (staff && staff.users) {
      const formattedDate = new Date(staff.users.birth_date).toISOString().split('T')[0];
      setFormData(prevData => ({
        ...prevData,
        users: {
          ...prevData.users,
          birth_date: formattedDate
        }
      }));
    }
  }, [staff]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Assuming that your form elements' names are prefixed by their nesting level, separated by a dot, e.g., "users.firstName"
    const nameParts = name.split('.');
  
    setFormData(prevData => {
      // Handle nested properties like 'users.firstName'
      if (nameParts.length > 1) {
        const [mainKey, subKey] = nameParts;
        return {
          ...prevData,
          [mainKey]: {
            ...prevData[mainKey],
            [subKey]: value
          }
        };
      } else {
        // Handle non-nested properties like 'salary'
        return {
          ...prevData,
          [name]: value
        };
      }
    });
    console.log("Form data: ", formData);
    // console.log("Form data birth_date: ", formData.users.birth_date); // Note: This log may not immediately reflect changes due to the async nature of `setFormData`
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    console.log("Final form: ", formData)
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error("No token found");
      console.log("formData job: ", formData.job);
      await axios.patch(`http://localhost:8080/users/update-staff/${encodeURIComponent(staff.s_id)}/${encodeURIComponent(staff.users.role)}`, {
        Fname: formData.Fname,
        Minit: formData.users.Minit,
        Lname: formData.users.Lname,
        birth_date: new Date(formData.users.birth_date),
        phone: formData.users.phone,
        job_id: parseInt(formData.job_id),
        manager_id: parseInt(formData.manager_id),
        dept_id : parseInt(formData.departments.dept_id),

        // manager_id: formData.manager,
        // dept_id : formData.departments.dept_id,
        // email: updatedStaff.users.email,
        salary: formData.salary,
        qualifications: formData.qualifications
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      onUpdate(formData);
      setSuccessMessage('Profile updated successfully.');

      await axios.post(`http://localhost:8080/jobs/add-new-jobs-history/`, {
        job_id: parseInt(formData.jobs.job_id),
        s_id: staff.s_id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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
                value={formData.users.username}
                disabled
                className="p-3 border text-black border-gray-300 rounded-md disabled:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />

            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="firstName" className="text-sm font-semibold text-[#1F2B6C]">First Name</label>
              <input
                type="text"
                id="firstName"
                // name="firstName"
                name = "users.Fname"
                defaultValue={formData.users.Fname}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="mInit" className="text-sm font-semibold text-[#1F2B6C]">Middle Name</label>
              <input
                type="text"
                id="mInit"
                name="users.Minit"
                defaultValue={formData.users.Minit}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="lastName" className="text-sm font-semibold text-[#1F2B6C]">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="users.Lname"
                defaultValue={formData.users.Lname}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="sex" className="text-sm font-semibold text-[#1F2B6C]">Sex</label>
              <div className="relative">
                <select
                  id="sex"
                  name="users.sex"
                  defaultValue={formData.users.sex}
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
                name="users.phone"
                defaultValue={formData.users.phone}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-[#1F2B6C]">Email</label>
              <input
                type="email"
                id="email"
                name="users.email"
                value={formData.users.email}
                readOnly
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="birth_date" className="text-sm font-semibold text-[#1F2B6C]">Date of Birth</label>
              <input
                type="date"

                id="birth_date"
                name="users.dob"
                value={new Date (formData.users.birth_date).toISOString().split("T")[0]}

// <!--                 id="dob"
//                 name="dob"
//                 value={formatDate(formData.users.birth_date)} -->

                onChange={handleChange}
                max={today}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="job_id" className="text-sm font-semibold text-[#1F2B6C]">Job</label>
              <select
                id="job_id"
                name="job_id"
                value={parseInt(formData.job_id)}
                onChange={handleChange}
                className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              >
                <option value="">Select job</option>
                {jobList.map((job) => (
                  <option key={job.job_id} value={job.job_id}>{job.job_title}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="manager" className="text-sm font-semibold text-[#1F2B6C]">Manager</label>
              <select
                id="manager"
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
                className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              >
                <option value="">None</option>
                {managerList.map((manager) => (
                  <option key={manager.manager_id} value={manager.manager_id}>{manager.users.username}</option>
                ))}
              </select>

{/* <!--               <label htmlFor="job" className="text-sm font-semibold text-[#1F2B6C]">Job</label>
              <div className="relative">
                <select
                  id="job"
                  name="job"
                  value={formData.jobs.job_id}
                  onChange={handleChange}
                  className="appearance-none p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                >
                  <option value="">Select job</option>
                  {jobList.map((job) => (
                    <option key={job.job_id} value={job.job_id}>{job.job_title}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="manager_id" className="text-sm font-semibold text-[#1F2B6C]">Manager</label>
              <div className="relative">
                <select
                  id="manager_id"
                  name="manager_id"
                  value={formData.manager}
                  onChange={handleChange}
                  className="appearance-none p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                >
                  <option value="">None</option>
                  {managerList.map((manager) => (
                    <option key={manager.manager_id} value={manager.manager_id}>{manager.users.username}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div> --> */}

            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="qualification" className="text-sm font-semibold text-[#1F2B6C]">Qualification</label>
              <input
                type="text"
                id="qualifications"
                name="qualifications"
                defaultValue={formData.qualifications}
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
                value={formData.departments.dept_id}
                onChange={handleChange}
                className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              >
                <option value="">Select department</option>
                {departmentList.map((department) => (
                  <option key={department.dept_id} value={department.dept_id}>{department.dept_name}</option>
                ))}
              </select>

{/* <!--               <div className="relative">
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="appearance-none p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                >
                  <option value="">Select department</option>
                  {departmentList.map((department) => (
                    <option key={department.dept_id} value={department.dept_id}>{department.dept_name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div> --> */}

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
