"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Schedule {
  scheduled_id: string;
  scheduled_date: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface UpdateScheduleProps {
  schedule: Schedule;
  onClose: () => void;
  onUpdate: (updatedData: Schedule) => void;
}

const UpdateSchedule: React.FC<UpdateScheduleProps> = ({ schedule, onClose, onUpdate }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    scheduled_date: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const [timeConstraints, setTimeConstraints] = useState({
    minTime: "",
    maxEndTime: "",
  });

  const [dateConstraints, setDateConstraints] = useState({
    minDate: "",
    maxDate: "",
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          throw new Error("No access token found.");
        }

        const scheduled_id = parseInt(localStorage.getItem("scheduled_id") ?? "");
        console.log(scheduled_id);
        // Fetch schedule logic here
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSchedule();

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
  }, []);

  useEffect(() => {
    // Convert the date to YYYY-MM-DD format
    if (schedule) {
      const formattedDate = new Date(schedule.schedule_date).toISOString().split('T')[0];
      setFormData(prevData => ({
        ...prevData,
        schedule: {
          ...prevData.schedule,
          schedule_date: formattedDate
        }
      }));
    }
  }, [schedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData, [id]: value };

      if (id === "startTime" && newData.date) {
        const startTime = new Date(`${newData.date}T${value}`);
        // Ensure that endTime is always later than startTime
        const maxEndTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // Add 2 hours
          .toISOString()
          .split("T")[1]
          .slice(0, 5);

        return {
          ...newData,
          endTime: newData.endTime && new Date(`${newData.date}T${newData.endTime}`) <= startTime
            ? "" // Clear endTime if it's not valid
            : newData.endTime,
          maxEndTime,
        };
      }

      if (id === "endTime" && newData.date) {
        const startTime = new Date(`${newData.date}T${newData.startTime}`);
        const endTime = new Date(`${newData.date}T${value}`);

        // Ensure that endTime is always later than startTime
        if (endTime <= startTime) {
          setErrorMessage("End time must be after start time.");
        } else {
          setErrorMessage("");
        }
      }

      return newData;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const startTime = new Date(`${formData.scheduled_date}T${formData.startTime}`);
    const endTime = new Date(`${formData.scheduled_date}T${formData.endTime}`);

    if (endTime <= startTime) {
      setErrorMessage("End time must be after start time.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      await axios.post(
        `http://localhost:8080/staff/schedule/${encodeURIComponent(schedule.scheduled_id)}`,
        {
          date: new Date(formData.scheduled_date),
          startTime: formData.startTime,
          endTime: formData.endTime,
          description: formData.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage("Schedule created successfully.");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 3000);
    } catch (error: any) {
      const errorDetail = error.response?.data?.message || error.message;
      setErrorMessage(`Failed to create schedule: ${errorDetail}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Edit Staff Schedule</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="date" className="text-sm font-semibold text-[#1F2B6C]">
                Choose a date <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="date"
                id="scheduled_date"
                value={formatDate(formData.scheduled_date)}
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
              <label htmlFor="description" className="text-sm font-semibold text-[#1F2B6C]">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add schedule description"
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
          </div>

          {successMessage && (
            <div className="mt-4 p-4 border border-green-500 rounded text-green-700 bg-green-100">
              {successMessage}
            </div>
          )}

          <div className="flex justify-end mt-4 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="h-11 w-[155px] border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 w-[155px] rounded-full text-white bg-[#1F2B6C] flex items-center justify-center hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Schedule"}
            </button>

          </div>
        </form>

        {errorMessage && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateSchedule;
