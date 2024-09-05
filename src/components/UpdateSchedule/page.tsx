"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Schedule {
  id: string;
  date: string;
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
    ...schedule, // Initialize with schedule data
  });

  const [timeConstraints, setTimeConstraints] = useState({
    minTime: "",
    maxEndTime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [id]: value };

      if (id === "date") {
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate.toDateString() === today.toDateString()) {
          const minTime = today.toTimeString().slice(0, 5);
          setTimeConstraints((prev) => ({ ...prev, minTime }));
        } else {
          setTimeConstraints((prev) => ({ ...prev, minTime: "" }));
        }
      }

      if (id === "startTime") {
        const startTime = new Date(`${newData.date}T${value}`);
        const maxEndTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[1]
          .slice(0, 5);

        return { ...newData, endTime: newData.endTime <= value ? "" : newData.endTime, maxEndTime };
      }

      return newData;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      await axios.post(
        `http://localhost:8080/staff/schedule/${encodeURIComponent(schedule.id)}`, // Use schedule.id
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdate(formData); // Call the update function
      setSuccessMessage("Schedule updated successfully.");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 3000);
    } catch (error) {
      setErrorMessage("Failed to update schedule.");
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
                id="date"
                value={formData.date}
                onChange={handleChange}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="startTime" className="text-sm font-semibold text-[#1F2B6C]">
                Start time
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
