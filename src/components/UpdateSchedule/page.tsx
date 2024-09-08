"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { newDate } from "react-datepicker/dist/date_utils";

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
    minTime: "",
    maxEndTime: "",
  });

  const [dateConstraints, setDateConstraints] = useState({
    minDate: "",
    maxDate: "",
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const id = parseInt(localStorage.getItem("id") ?? "");
    setUserId(id);
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          throw new Error("No access token found.");
        }

        const scheduled_id = parseInt(
          localStorage.getItem("scheduled_id") ?? ""
        );
        // console.log("formData: ", formData)
        // console.log(scheduled_id);
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
      const formattedDate = new Date(schedule.scheduled_date)
        .toISOString()
        .split("T")[0];

      setFormData((prevData) => ({
        ...prevData,
        schedule: {
          ...prevData.schedule,
          scheduled_date: formattedDate,
        },
      }));
      console.log("formData: ", formData);
      console.log("schedule check ne: ", schedule);
    }
  }, [schedule]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    setFormData((prevData) => {
      // Immediately updating the state for the current change
      const updatedData = { ...prevData, [id]: value };

      // Special handling for time-related logic
      if (id === "start_time" || id === "end_time") {
        const startDate = updatedData["scheduled_date"];
        if (!startDate) {
          // If there's no date, we cannot calculate time correctly, show error or a message if needed
          return updatedData;
        }

        const startTimeValue =
          id === "start_time" ? value : updatedData["start_time"];
        const endTimeValue =
          id === "end_time" ? value : updatedData["end_time"];

        if (startTimeValue && endTimeValue) {
          const startDateTime = new Date(`${startDate}T${startTimeValue}`);
          const endDateTime = new Date(`${startDate}T${endTimeValue}`);

          // Ensuring that the end time is at least the start time or later
          if (endDateTime <= startDateTime) {
            setErrorMessage("End time must be after start time.");
            // Reset the end time if it's before the start time when changing start time
            if (id === "start_time") {
              return { ...updatedData, endTime: "" };
            }
            // Do not update the end time if it is invalid when explicitly set
            return { ...prevData, [id]: value };
          } else {
            setErrorMessage("");
          }
        }
      }
      console.log("updatedData: ", updatedData);
      return updatedData;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const start_time = new Date(
      `${formData.scheduled_date}T${formData.start_time}`
    );
    const end_time = new Date(
      `${formData.scheduled_date}T${formData.end_time}`
    );

    if (end_time <= start_time) {
      setErrorMessage("End time must be after start time.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");
      // console.log("formData start time11: ", new Date(formData.start_time));
      // console.log("formData end time1: ", new Date(formData.end_time));
      // console.log("id: ", userId)

      // const today = new Date().toISOString().split('T')[0];
      // const startTimeString  = formData.start_time;
      // const endTimeString = formData.end_time;
      // const startTime = new Date(`${today}T${startTimeString}:00`);
      // const endTime = new Date(`${today}T${endTimeString}:00`);

      // const startTimeObject = new Date(startTime);
      // const endTimeObject = new Date(endTime);
      const today = new Date();
      const startTimeString = formData.start_time; // Assume this is '15:00' (3:00 PM)
      const endTimeString = formData.end_time; // Assume this is '17:00' (5:00 PM)

      // Create dates in UTC
      const startTime = new Date(
        Date.UTC(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          parseInt(startTimeString.split(":")[0]),
          parseInt(startTimeString.split(":")[1])
        )
      );

      const endTime = new Date(
        Date.UTC(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          parseInt(endTimeString.split(":")[0]),
          parseInt(endTimeString.split(":")[1])
        )
      );

      console.log("startTimeObject: ", startTime);
      console.log("endTimeObject: ", endTime);
      await axios.patch(
        `http://localhost:8080/staff/update-schedule/${encodeURIComponent(
          userId
        )}`,
        {
          scheduled_id: parseInt(schedule.scheduled_id),
          scheduled_date: new Date(formData.scheduled_date),
          start_time: startTime,
          end_time: endTime,
          description: formData.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log("Data after update: ", new Date(formData.start_time))
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
              <label
                htmlFor="date"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Choose a date <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="date"
                id="scheduled_date"
                // value={formatDate(formData.scheduled_date)}
                // defaultValue= {new Date (formData.scheduled_date).toISOString().split("T")[0]}
                onChange={handleChange}
                min={dateConstraints.minDate}
                max={dateConstraints.maxDate}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="start_time"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                Start time <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="time"
                id="start_time"
                defaultValue={formData.start_time}
                onChange={handleChange}
                // min={timeConstraints.minTime}
                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="end_time"
                className="text-sm font-semibold text-[#1F2B6C]"
              >
                End time <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="time"
                id="end_time"
                defaultValue={formData.end_time}
                onChange={handleChange}
                // min={formData.start_time}
                // max={timeConstraints.maxEndTime}
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
