"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { set } from "react-datepicker/dist/date_utils";

export default function AddStaff() {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    mInit: "",
    lastName: "",
    phone: "",
    dob: "",
    sex: "",
    email: "",
    password: "",
    job: "",
    manager: "",
    department: "",
    salary: 0,
    qualification: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  const [managerList, setManagerList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    setToday(todayDate);

    const fetchStaff = async () => {
      try {
        // Fetch managers
        const responseManagers = await fetch("/api/manager");
        const dataManagers = await responseManagers.json();
        setManagerList(dataManagers);

        // Fetch jobs
        const responseJobs = await fetch("/api/jobs"); // Update this URL with the actual endpoint
        const dataJobs = await responseJobs.json();
        setJobList(dataJobs);

        // Fetch departments
        const responseDepartments = await fetch("/api/departments"); // Update this URL with the actual endpoint
        const dataDepartments = await responseDepartments.json();
        setDepartmentList(dataDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStaff();
  }, []);


  const handleAddStaff = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Validate the form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found.");
        setLoading(false);
        return;
      }

      //format birth date
      const [year, month, day] = formData.dob.split("-");
      const birth_date = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );

      // Fetch department ID
      const responseDepartment = await axios.get(
        `http://localhost:8080/department/find-department-id-by-name/${encodeURIComponent(
          formData.department
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const department_data = responseDepartment.data;
      const department_id = department_data.dept_id // Assuming the API returns the department details
      console.log("oke nhna", department_id); // Log or process the fetched department data

      const response = await axios.post(
        "http://localhost:8080/users",
        {
          username: formData.username,
          pw: formData.password,
          Fname: formData.firstName,
          Minit: formData.mInit,
          Lname: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          sex: formData.sex,
          birth_date: birth_date,
          roles: 2,
          job: formData.job,
          manager: formData.manager,
          dept_id: department_id,
          salary: formData.salary,
          qualifications: formData.qualification,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("You have successfully created new staff!");

      setTimeout(() => {
        setSuccessMessage("");
        window.location.href = "/admin/staff";
      }, 5000);
    } catch (error: any) {
      setError(
        error.response.data.message ||
        "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
    console.log(formData);
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[^\w\s]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    return errors;
  };

  const validateForm = () => {
    let errors: string[] = [];

    if (!formData.email.endsWith("@gmail.com")) {
      errors.push("Email must end with '@gmail.com'.");
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      errors.push("Phone number must be exactly 10 digits.");
    }
    if (!formData.email.includes("@")) {
      errors.push("Please enter a valid email.");
    }

    const passwordValidationErrors = validatePassword(formData.password);
    if (passwordValidationErrors.length > 0) {
      errors = [...errors, ...passwordValidationErrors];
    }

    if (formData.salary < 0) {
      errors.push("Salary must be greater than or equal to 0.");
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
      return false;
    }

    setError("");
    return true;
  };

  return (
    <div className="min-h-screen flex justify-center">
      <main className="flex flex-col flex-grow p-3 justify-center items-center">
        <div className="container p-12 max-w-3xl rounded-lg bg-[#BFD2F8] bg-opacity-[50%] shadow-lg">
          <div className="flex justify-center mb-8">
            <h1 className="text-3xl font-bold text-[#1F2B6C]">Add New Staff</h1>
          </div>
          <form
            onSubmit={handleAddStaff}
            className="container-content grid grid-cols-2 gap-3"
          >
            {" "}
            {/* Updated grid layout */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="firstName"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                id="firstName"
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
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                id="lastName"
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
                Sex <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  id="sex"
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
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="dob"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="date"
                id="dob"
                max={today}
                value={formData.dob}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>

            <div className='flex flex-col space-y-2'>
              <label htmlFor="manager" className="text-sm font-semibold text-[#1F2B6C]">
                Manager
              </label>
              <div className='relative'>
                <select
                  id="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="p-3 appearance-none w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                >
                  <option value="" disabled>Select a manager</option>
                  {managerList.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"> {/* Adjusted positioning */}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="job"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Job <span className="text-red-500">*</span>
              </label>
              <div className='relative'>
                <select
                  required
                  id="job"
                  value={formData.job}
                  onChange={handleChange}
                  className="p-3 appearance-none w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                >
                  <option value="" disabled>Select a job</option>
                  {jobList.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"> {/* Adjusted positioning */}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="department"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Department <span className="text-red-500">*</span>
              </label>
              <div className='relative'>
                <select
                  required
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="p-3 appearance-none w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                >
                  <option value="" disabled>Select a department</option>
                  {departmentList.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none"> {/* Adjusted positioning */}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="salary"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Salary <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                id="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
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
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Enter qualification"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                />
                <div
                  onClick={handleShowPassword}
                  className="absolute inset-y-0 right-[1rem] flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.48 19.48C17.6152 20.9015 15.3445 21.6889 13 21.7273C5.36364 21.7273 1 13 1 13C2.35697 10.4712 4.23906 8.26176 6.52 6.52001M10.7091 4.53455C11.46 4.35878 12.2288 4.27092 13 4.27273C20.6364 4.27273 25 13 25 13C24.3378 14.2388 23.5481 15.4052 22.6436 16.48M15.3127 15.3127C15.0131 15.6343 14.6518 15.8922 14.2503 16.071C13.8489 16.2499 13.4155 16.3461 12.9761 16.3539C12.5367 16.3616 12.1002 16.2808 11.6927 16.1162C11.2852 15.9516 10.915 15.7066 10.6042 15.3958C10.2934 15.085 10.0484 14.7149 9.88383 14.3073C9.71923 13.8998 9.63839 13.4633 9.64615 13.0239C9.6539 12.5845 9.75008 12.1511 9.92896 11.7497C10.1078 11.3482 10.3657 10.9869 10.6873 10.6873"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M1 1L25 25"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 26 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 9.72727C1 9.72727 5.36364 1 13 1C20.6364 1 25 9.72727 25 9.72727C25 9.72727 20.6364 18.4545 13 18.4545C5.36364 18.4545 1 9.72727 1 9.72727Z"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12.9998 13C14.8073 13 16.2725 11.5348 16.2725 9.72732C16.2725 7.91984 14.8073 6.45459 12.9998 6.45459C11.1923 6.45459 9.72705 7.91984 9.72705 9.72732C9.72705 11.5348 11.1923 13 12.9998 13Z"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            {error && (
              <div className="col-span-2 text-red-500 text-sm font-semibold">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="col-span-2 text-green-500 text-sm font-semibold">
                {successMessage}
              </div>
            )}
            <div className="col-span-2 flex justify-between items-center mt-2">
              <button
                type="submit"
                className="w-full bg-[#1F2B6C] hover:bg-[#1F2B6C] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? "Adding Staff..." : "Add Staff"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
