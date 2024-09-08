"use client";
import { useState, useEffect } from "react";
import "./appointment.scss";
import axios from "axios";
import { useUserContext } from "@/app/context";

export default function Appointment() {
  const [error, setError] = useState<string>("");
  const { user } = useUserContext();
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    staff: "",
    purpose: "",
    location: "",
    meeting_status: "",
    note: "",
  });

  const [timeConstraints, setTimeConstraints] = useState({
    minTime: "",
    maxEndTime: "",
  });

  const [dateConstraints, setDateConstraints] = useState({
    minDate: "",
    maxDate: "",
  });

  const [staffAvailableList, setStaffAvailableList] = useState([]);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await axios.get("http://localhost:8080/staff/list-staff-by-name/asc", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }); // Replace with your API endpoint

        const data = response.data;
        console.log(data);
        setStaffAvailableList(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();

    const today = new Date();
    const minDate = today.toISOString().split("T")[0];

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);
    const maxDateString = maxDate.toISOString().split("T")[0];

    setDateConstraints({
      minDate,
      maxDate: maxDateString,
    });

    const now = new Date();
    const minTime = now.toTimeString().split(" ")[0].slice(0, 5);

    setTimeConstraints({
      minTime,
      maxEndTime: "", // Initial empty maxEndTime
    });

    // Debugging dates and times
    // console.log("Minimum Date:", minDate);
    // console.log("Maximum Date:", maxDateString);
    // console.log("Current Time:", minTime);
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [id]: value,
      };

      if (id === "date") {
        const selectedDate = new Date(value);
        const today = new Date();

        if (selectedDate.toDateString() === today.toDateString()) {
          const now = new Date();
          const minTime = now.toTimeString().split(" ")[0].slice(0, 5);
          setTimeConstraints((prevConstraints) => ({
            ...prevConstraints,
            minTime,
          }));
        } else {
          setTimeConstraints((prevConstraints) => ({
            ...prevConstraints,
            minTime: "", // No minTime constraint for future dates
          }));
        }
      }

      if (id === "startTime") {
        const startTime = new Date(`${newData.date}T${value}`);
        const maxEndTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // Add 2 hours
          .toISOString()
          .split("T")[1]
          .slice(0, 5);

        return {
          ...newData,
          endTime: newData.endTime <= value ? "" : newData.endTime,
          maxEndTime,
        };
      }

      return newData;
    });
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
      console.log("id", user.id);
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:8080/appointment/",
        {
          meeting_date: formData.date,
          p_id: parseInt(user.id),
          s_id: parseInt(formData.staff),
          purpose: formData.purpose,
          start_time: formData.startTime,
          end_time: formData.endTime,
          location: "Room 101",
          meeting_status: true,
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
              response.data.data.meeting_date.slice(0, 10) || "N/A"
            }</span><br/>
            The purpose is about: <span style="color: red;">${response.data.data.purpose || "N/A"}</span><br/>
            Start from: <span style="color: red;">${
              response.data.data.start_time.slice(11, 16) || "N/A"
            }</span> to <span style="color: red;">${response.data.data.end_time.slice(11, 16) || "N/A"}</span><br/>
            With staff: <span style="color: red;">${response.data.data.staff.users.Fname || "N/A"}</span><br/>
            At location: <span style="color: red;">${response.data.data.location || "N/A"}</span><br/>
        `);

      // Reset form data
      setFormData({
        date: "",
        startTime: "",
        endTime: "",
        staff: "",
        purpose: "",
        location: "",
        meeting_status: "",
        note: "",
      });
      setError("");
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000); // Message will disappear after 10 seconds
    } catch (error: any) {
      setError( error.response.data.message || "An error occurred. Please try again later.");
    }
  };

  return (
    <div className="appointment min-h-screen flex flex-col bg-[#F5F8FF]">
      <main className="flex flex-col flex-grow bg-white p-8 justify-center items-center">
        <div className="container px-[70px] py-12 max-w-2xl rounded-lg bg-[#BFD2F8] bg-opacity-[50%] shadow-lg">
          <div className="flex justify-center mb-8">
            <h1 className="text-3xl font-bold text-[#1F2B6C]">Make an Appointment</h1>
          </div>

          <form className="container-content grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
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

            <div className="flex flex-col space-y-2">
              <label htmlFor="startTime" className="text-sm font-semibold text-[#1F2B6C]">
                Start time <span className="text-red-500">*</span>
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

            <div className="flex flex-col space-y-2">
              <label htmlFor="endTime" className="text-sm font-semibold text-[#1F2B6C]">
                End time <span className="text-red-500">*</span>
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

            <div className="flex flex-col space-y-2">
              <label htmlFor="purpose" className="text-sm font-semibold text-[#1F2B6C]">
                Purpose <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Add appoinment's purpose"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="staff" className="text-sm font-semibold text-[#1F2B6C]">
                Staff <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="staff"
                  value={formData.staff}
                  onChange={handleChange}
                  className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] bg-white appearance-none"
                >
                  <option value="">Select Staff</option>
                  {staffAvailableList.map((staff) => (
                    <option key={staff.s_id} value={staff.s_id}>
                      {staff.users.Fname}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-[1rem] flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/*
            <div className="flex flex-col space-y-2">
              <label htmlFor="note" className="text-sm font-semibold text-[#1F2B6C]">
                Note
              </label>
              <input
                type="text"
                id="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Add your note"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            */}

            {successMessage && (
              <div
                className="mt-4 p-4 border border-green-500 rounded text-green-700 bg-green-100"
                dangerouslySetInnerHTML={{ __html: successMessage }}
              />
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="h-[45px] w-full mt-4 border border-[#C5DCFF] rounded-md
                                            bg-[#1F2B6C] text-white
                                            hover:bg-[#1D3F7F] hover:shadow-lg 
                                            focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Make an Appointment
              </button>
            </div>
          </form>
          {error && (
            <div className="error-message mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
