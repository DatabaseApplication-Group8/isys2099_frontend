import React, { useState, useEffect } from "react";
import axios from "axios";

interface Schedule {
  scheduled_id: string;
  scheduled_date: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface CreateScheduleProps {
  schedule: Schedule;
  onClose: () => void;
  onUpdate: (updatedData: Schedule) => void;
}

const CreateSchedule: React.FC<CreateScheduleProps> = ({
  schedule,
  onClose,
  onUpdate,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(0);

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

  useEffect(() => {
    const id = localStorage.getItem("id");
    setUserId(parseInt(id ?? "0"));
  }, []);

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
    const minTime = now.toTimeString().split(" ")[0].slice(0, 5);

    setTimeConstraints({
      minTime,
      maxEndTime: "", // Initial empty maxEndTime
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData, [id]: value };

      if (id === "scheduled_date") {
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
            minTime: "00:00", // No minTime constraint for future dates
          }));
        }
      }

      if (id === "startTime") {
        const startTime = new Date(`${newData.scheduled_date}T${value}`);
  

        return {
          ...newData,
          endTime:
            newData.endTime <= value
              ? ""
              : newData.endTime,
        };
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
      console.log("userid:", userId);

      const response = await axios.post(
        `http://localhost:8080/staff/add-new-schedule/${encodeURIComponent(userId)}`,
        {
          scheduled_date: new Date(formData.scheduled_date),
          start_time: new Date(`${formData.scheduled_date}T${formData.startTime}:00Z`),
          end_time: new Date(`${formData.scheduled_date}T${formData.endTime}:00Z`),
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
        <h2 className="text-2xl font-semibold mb-4">Create Staff Schedule</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="scheduled_date"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
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
              <label
                htmlFor="startTime"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
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
              <label
                htmlFor="endTime"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
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
              <label
                htmlFor="description"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
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
            <div className="text-green-500 mt-4">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}

          <div className="flex justify-end mt-6 space-x-5">
            <button
              type="submit"
              className="bg-[#1F2B6C] text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Schedule"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSchedule;
