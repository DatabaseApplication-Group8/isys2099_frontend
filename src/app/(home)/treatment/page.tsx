"use client";
import { useState, useEffect } from 'react';
import axios from "axios";
import { useUserContext } from "@/app/context";

export default function Treatment() {
    const { user } = useUserContext();
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [doctorAvailableList, setDoctorAvailableList] = useState([]);

    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        doctor: '',
        description: ''
    });

    const [timeConstraints, setTimeConstraints] = useState({
        minTime: '',
        maxEndTime: "",
    });

    const [dateConstraints, setDateConstraints] = useState({
        minDate: '',
        maxDate: ''
    });

    useEffect(() => {
        const fetchDoctor = async () => {
            const accessToken = localStorage.getItem("accessToken");
            try {
                const response = await axios.get("http://localhost:8080/staff/list-staff-by-name/asc", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }); 

                const data = response.data;
                console.log(data);
                setDoctorAvailableList(data);
            } catch (error) {
                console.error("Error fetching doctor:", error);
            }
        };

        fetchDoctor();

        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];

        // Set the maximum date to 2 weeks from today
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 14);
        const maxDateString = maxDate.toISOString().split('T')[0];

        setDateConstraints({
            minDate,
            maxDate: maxDateString
        });

        // Get current time in HH:MM format
        const now = new Date();
        const minTime = now.toTimeString().split(' ')[0].slice(0, 5); // Extract HH:MM

        setTimeConstraints({
            minTime,
            maxEndTime: "",
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prevFormData => {
            const updatedFormData = {
                ...prevFormData,
                [id]: value,
            };

            if (id === "date") {
                const selectedDate = new Date(value);
                const today = new Date();

                if (selectedDate.toDateString() === today.toDateString()) {
                    const now = new Date();
                    const minTime = now.toTimeString().split(" ")[0].slice(0, 5);
                    setTimeConstraints(prevConstraints => ({
                        ...prevConstraints,
                        minTime,
                    }));
                } else {
                    setTimeConstraints(prevConstraints => ({
                        ...prevConstraints,
                        minTime: "", // No minTime constraint for future dates
                    }));
                }
            }

            if (id === "startTime") {
                const startTime = new Date(`${formData.date}T${value}`);
                const maxEndTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // Add 2 hours
                    .toISOString()
                    .split("T")[1]
                    .slice(0, 5);

                return {
                    ...updatedFormData,
                    endTime: updatedFormData.endTime <= value ? "" : updatedFormData.endTime,
                    maxEndTime,
                };
            }

            return updatedFormData;
        });

        if (id === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();

            if (selectedDate.toDateString() === today.toDateString()) {
                const now = new Date();
                const minTime = now.toTimeString().split(' ')[0].slice(0, 5);
                setTimeConstraints(prevConstraints => ({
                    ...prevConstraints,
                    minTime
                }));
            } else {
                setTimeConstraints(prevConstraints => ({
                    ...prevConstraints,
                    minTime: '' // No minTime constraint for future dates
                }));
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const startTime = new Date(`${formData.date}T${formData.startTime}`);
        const endTime = new Date(`${formData.date}T${formData.endTime}`);

        if (endTime <= startTime) {
            alert("End time must be after start time.");
            return;
        }

        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.post(
              "http://localhost:8080/treatment/",
              {
                treatment_date: formData.date,
                start_time: new Date(`${formData.date}T${formData.startTime}:00Z`),
                end_time: new Date(`${formData.date}T${formData.endTime}:00Z`),
                doctor_id: parseInt(formData.doctor),
                p_id: parseInt(user.id),
                description: formData.description,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            console.log("Form submitted with data:", formData);

            setSuccessMessage(`
                You have successfully made an appointment on <span style="color: red;">${
                  formData.date || "N/A"
                }</span><br/>
                Start from: <span style="color: red;">${
                  response.data.data.start_time.slice(11, 16) || "N/A"
                }</span> to <span style="color: red;">${response.data.data.end_time.slice(11, 16) || "N/A"}</span><br/>
                With doctor: <span style="color: red;">${response.data.data.staff.users.Fname || "N/A"}</span><br/>
                Billing: <span style="color: red;">${response.data.data.billing}$</span><br/>
                Treatment's description: <span style="color: red;">${formData.description || "N/A"}</span><br/>
            `);
            // Reset form data
            setFormData({
                date: "",
                startTime: "",
                endTime: "",
                doctor: "",
                description: "",
            });
            setError("");
            setTimeout(() => {
                setSuccessMessage(null);
            }, 10000); // Message will disappear after 10 seconds
        } catch (error: any) {
            setError(error.response?.data?.message || "An error occurred. Please try again later.");
        }
    };

    return (
        <div className="treatment min-h-screen flex flex-col bg-[#F5F8FF]">
            <main className="treatment flex flex-col flex-grow bg-white p-8 justify-center items-center">
                <div className="container px-[70px] py-12 max-w-2xl rounded-lg bg-[#BFD2F8] bg-opacity-[50%] shadow-lg">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-3xl font-bold text-[#1F2B6C]">Book Treatment</h1>
                    </div>

                    <form className="container-content grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="date" className="text-sm font-semibold text-[#1F2B6C]">
                                Choose a date <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="date"
                                id="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={dateConstraints.minDate}
                                max={dateConstraints.maxDate}
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="startTime" className="text-sm font-semibold text-[#1F2B6C]">
                                Start Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="time"
                                id="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                min={timeConstraints.minTime}
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="endTime" className="text-sm font-semibold text-[#1F2B6C]">
                                End Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="time"
                                id="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                min={formData.startTime}
                                max={timeConstraints.maxEndTime}
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="doctor" className="text-sm font-semibold text-[#1F2B6C]">
                                Doctor <span className="text-red-500">*</span>
                            </label>
                            <div className='relative'>
                                <select
                                    id="doctor"
                                    value={formData.doctor}
                                    onChange={handleChange}
                                    className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] bg-white appearance-none"
                                >
                                    <option value="">Select Doctor</option>
                                    {doctorAvailableList.map(doctor => (
                                        <option key={doctor.s_id} value={doctor.s_id}>{doctor.users.Fname}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-[1rem] flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="description" className="text-sm font-semibold text-[#1F2B6C]">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <button
                                type="submit"
                                className="bg-[#1F2B6C] text-white p-3 rounded-md hover:bg-[#0d1a4b]"
                            >
                                Book Treatment
                            </button>
                        </div>
                    </form>

                    {successMessage && (
                        <div
                            className="success-message mt-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md"
                            dangerouslySetInnerHTML={{ __html: successMessage }}
                        />
                    )}

                    {error && (
                        <div
                            className="error-message mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md"
                        >
                            {error}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
