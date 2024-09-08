"use client";

import React, { useState, useEffect, use } from "react";
import UpdateSchedule from "@/components/UpdateSchedule/page";
import axios from "axios";
import { Appointment, PersonalScheduleItem, Treatment } from "@/types/user";
import { set } from "react-datepicker/dist/date_utils";


import CreateSchedule from '@/components/CreateSchedule/page';


// Define types for your schedule data
interface ScheduleItem {
  startTime: string;
  endTime: string;
  patientName: string;
  type: string;
  description: string;
}

export default function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [personalSchedule, setPersonalSchedule] = useState<
    PersonalScheduleItem[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  const [treatments, setTreatment] = useState<Treatment[]>([]);
  const [appointments, setAppointment] = useState<Appointment[]>([]);
  const [userId, setUserId] = useState<number>(0);

  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [scheduleToUpdate, setScheduleToUpdate] = useState<PersonalScheduleItem | null>(null);


  const handleUpdateClick = (schedule: PersonalScheduleItem) => {
    setScheduleToUpdate(schedule);
    setShowUpdateForm(true);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  useEffect(() => {

    console.log("Updated appointment state: ", appointments);
  }, [appointments, treatments]);  // This will log every time `appointment` changes.

  useEffect(() => {
    console.log("Updated treatment state: ", treatments);
  }, [treatments]);  // This will log only once when the component mounts.

  const fetchData = async () => {
    try {
      const id = localStorage.getItem("id");
      setUserId(Number(id));
      console.log("User ID: ", id);
      if (selectedDate) {
        const response = await axios.get(
          `http://localhost:8080/appointment/by-date-range/${encodeURIComponent(userId)}/:${encodeURIComponent(selectedDate)}`,  // Removed the colon ':' before the variable part of the URL
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setAppointment(response.data);
        console.log("appointment data fetched: ", response.data);
        console.log("Updated appointment state: ", appointments);

        const treatments = await axios.get(
          `http://localhost:8080/treatment/by-treatment-date/${encodeURIComponent(userId)}/:${encodeURIComponent(selectedDate)}`,  // Removed the colon ':' before the variable part of the URL
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setTreatment(treatments.data);
        console.log("Treatment data fetched: ", treatments.data);


        const personalSchedule = await axios.get(
          `http://localhost:8080/staff/view-staff-schedule-by-date/${encodeURIComponent(userId)}/:${encodeURIComponent(selectedDate)}`,  // Removed the colon ':' before the variable part of the URL
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setPersonalSchedule(personalSchedule.data);

      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load schedule data.");

    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]); // This e

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleUpdateSchedule = (updatedData: PersonalScheduleItem) => {
    setSuccessMessage(`Schedule updated successfully.`);
    // Logic for updating schedule
  };

  const handleCreateSchedule = () => {
    setShowCreateForm(true);
  };

  const filteredAppointments = appointments.filter(
    (item) => item.purpose === "Consultation" || item.purpose === "Follow-up"
  );

  const filterTreatments = treatments.filter((item) => item.description === "Check-up");

  return (
    <div className="schedule p-8 bg-[#E6F0FF] min-h-screen">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          Staff Schedule
        </h1>
        <div className="mb-6 flex items-center space-x-4">
          <label htmlFor="date" className="text-lg font-medium text-gray-700">
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="text-black p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-[40%]">
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-lg p-4 h-[450px] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4 text-[#1F2B6C]">
                Personal Schedule on {selectedDate}
              </h2>
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1F2B6C] text-white">
                  <tr>

                    <th className="py-3 px-4 border-b border-gray-300">
                      Start Time
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300">
                      End Time
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300">
                      Description
                    </th>

                    <th className="py-3 px-4 border-b border-gray-300">Actions</th>

                  </tr>
                </thead>
                <tbody>
                  {personalSchedule.length > 0 ? (
                    personalSchedule.map((item, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                      >

                        {/* <td className="py-3 px-4 border-b border-gray-300">
                          {item.start_time}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-300">
                          {item.end_time}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-300">
                          {item.description}
                        </td> */}

                        <td className="text-black py-3 px-4 border-b border-gray-300">{formatTime(item.start_time)}</td>
                        <td className="text-black py-3 px-4 border-b border-gray-300">{formatTime(item.end_time)}</td>
                        <td className="text-black py-3 px-4 border-b border-gray-300">{item.description}</td>
                        <td className="text-black py-2 px-4 border-b">
                          <button
                            onClick={() => handleUpdateClick(item)}
                            className="bg-[#1F2B6C] text-white py-2 px-4 rounded-md hover:bg-blue-900"
                          >
                            Edit
                          </button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>

                      <td
                        colSpan="4" className="py-4 text-center text-gray-500"
                      >
                        No personal schedule for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-end w-full">
              <button
                onClick={handleCreateSchedule}
                className="bg-[#1F2B6C] text-white py-2 px-4 rounded-lg hover:scale-105 hover:shadow-lg"
              >
                Create Schedule
              </button>
            </div>

            {showCreateForm && (
              <CreateSchedule
                onClose={() => setShowCreateForm(false)} // Correct closing logic for Create form
                onUpdate={(newSchedule) => setPersonalSchedule([...personalSchedule, newSchedule])} // Add new schedule
              />
            )}

            {showUpdateForm && scheduleToUpdate && (
              <UpdateSchedule
                schedule={scheduleToUpdate}
                onUpdate={(updatedData) => handleUpdateSchedule(updatedData)} // Update schedule logic
                onClose={() => setShowUpdateForm(false)}
              />
            )}
          </div>
        </div>

        <div className="w-[60%]">
          {/* Treatments Section */}
          <div className="grid grid-rows-1 lg:grid-rows-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-4 h-[300px] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4 text-[#1F2B6C]">
                Treatments on {selectedDate}
              </h2>
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1F2B6C] text-white">
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-300">
                      Start Time
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300">
                      End Time
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300">
                      Patient
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.length > 0 ? (
                    treatments.map((treatment, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                      >
                        <td className="py-3 px-4 border-b border-gray-300">
                          {formatTime(treatment.start_time)}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-300">
                          {formatTime(treatment.end_time)}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-300">
                          {treatment.p_id}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-300">
                          {treatment.description}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-4 text-center text-gray-500"
                      >
                        No treatments for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Appointments Section */}
            <div className="bg-white rounded-lg shadow-lg p-4 h-[300px] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4 text-[#1F2B6C]">
                Appointments on {selectedDate}
              </h2>
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1F2B6C] text-white">
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-300">
                      Start Time
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300">
                      End Time
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300">
                      Patient
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                      >
                        <td className="py-3 px-4 border-b border-gray-300">
                          {formatTime(appointment.start_time)}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-300">
                          {formatTime(appointment.end_time)}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-300">
                          {appointment.p_id}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-300">
                          {appointment.purpose}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-4 text-center text-gray-500"
                      >
                        No appointments for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
