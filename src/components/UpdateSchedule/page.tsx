import React, { useState, useEffect } from "react";
import axios from "axios";

interface Schedule {
  scheduled_id: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  description: string;
}

interface UpdateScheduleProps {
  schedule: Schedule;
  onClose: () => void;
  onUpdate: (updatedData: Schedule) => void;
}

const UpdateSchedule: React.FC<UpdateScheduleProps> = ({
  schedule,
  onClose,
  onUpdate,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Schedule>(schedule);
  const [userId, setUserId] = useState<number>(0);

  const [timeConstraints, setTimeConstraints] = useState({
    minTime: "00:00", // Default min time for future dates
  });

  const [dateConstraints, setDateConstraints] = useState({
    minDate: "",
    maxDate: "",
  });

  useEffect(() => {
    const id = parseInt(localStorage.getItem("id") ?? "0");
    setUserId(id);
  }, []);

  useEffect(() => {
    if (schedule) {
      const formattedDate = new Date(schedule.scheduled_date)
        .toISOString()
        .split("T")[0];
  
      const formatTime = (time: string) => {
        const date = new Date(time);
        return date.toISOString().split("T")[1].slice(0, 5);
      };
  
      setFormData((prevData) => ({
        ...prevData,
        scheduled_date: formattedDate,
        start_time: formatTime(schedule.start_time),
        end_time: formatTime(schedule.end_time),
      }));
    }
  }, [schedule]);
  
  // Set date constraints and initialize min time based on current time
  useEffect(() => {
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
    const currentMinTime = now.toTimeString().split(" ")[0].slice(0, 5);
  
    // Ensure correct date comparison between today and the selected date
    if (
      schedule &&
      new Date(schedule.scheduled_date).toISOString().split("T")[0] === minDate
    ) {
      setTimeConstraints({
        minTime: currentMinTime,
      });
    } else {
      setTimeConstraints({
        minTime: "00:00", // No restrictions for future dates
      });
    }
  }, [schedule]);
  

  // Update time constraints based on selected date and current time
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [id]: value };

      if (id === "scheduled_date") {
        const selectedDate = new Date(value);
        const today = new Date();

        // If selected date is today, set min time to current time
        if (selectedDate.toDateString() === today.toDateString()) {
          const now = new Date();
          const currentMinTime = now.toTimeString().split(" ")[0].slice(0, 5); // Current time
          setTimeConstraints({
            minTime: currentMinTime,
          });
        } else {
          // For future dates, allow any time
          setTimeConstraints({
            minTime: "00:00", // Default min time for future dates
          });
        }
      }

      // Ensure the end time is after the start time
      if (id === "start_time") {
        const startTime = new Date(`${updatedData.scheduled_date}T${value}`);
        return {
          ...updatedData,
          end_time: updatedData.end_time <= value ? "" : updatedData.end_time,
        };
      }

      return updatedData;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const start_time = new Date(`${formData.scheduled_date}T${formData.start_time}`);
    const end_time = new Date(`${formData.scheduled_date}T${formData.end_time}`);

    if (end_time <= start_time) {
      setErrorMessage("End time must be after start time.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      await axios.patch(`http://localhost:8080/staff/update-schedule/${userId}`, {
        scheduled_id: parseInt(schedule.scheduled_id),
        scheduled_date: new Date(formData.scheduled_date),
        start_time: new Date(`${formData.scheduled_date}T${formData.start_time}:00Z`),
        end_time: new Date(`${formData.scheduled_date}T${formData.end_time}:00Z`),
        description: formData.description,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMessage("Schedule updated successfully.");
      setTimeout(() => {
        setSuccessMessage("");
        onUpdate(formData); // Notify parent about the update
        onClose();
      }, 3000);
    } catch (error: any) {
      const errorDetail = error.response?.data?.message || error.message;
      setErrorMessage(`Failed to update schedule: ${errorDetail}`);
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
              <label htmlFor="scheduled_date" className="text-sm font-semibold text-[#1F2B6C]">
                Choose a date <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="date"
                id="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                min={dateConstraints.minDate}
                max={dateConstraints.maxDate}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="start_time" className="text-sm font-semibold text-[#1F2B6C]">
                Start time <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="time"
                id="start_time"
                value={formData.start_time}
                onChange={handleChange}
                min={timeConstraints.minTime}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="end_time" className="text-sm font-semibold text-[#1F2B6C]">
                End time <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="time"
                id="end_time"
                value={formData.end_time}
                onChange={handleChange}
                min={formData.start_time}
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

          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded bg-white text-black"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#1F2B6C] text-white rounded-md hover:bg-blue-600"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSchedule;
