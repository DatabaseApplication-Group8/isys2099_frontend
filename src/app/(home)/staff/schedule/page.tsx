"use client";
import React, { useState, useEffect } from 'react';
import UpdateSchedule from '@/components/UpdateSchedule/page';

// Define types for your schedule data
interface ScheduleItem {
  startTime: string;
  endTime: string;
  patientName: string;
  type: string;
  description: string;
}

interface PersonalScheduleItem {
  startTime: string;
  endTime: string;
  activity: string;
  description: string;
}

export default function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [personalSchedule, setPersonalSchedule] = useState<PersonalScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  useEffect(() => {
    if (selectedDate) {
      // Mock data for testing
      const mockData: ScheduleItem[] = [
        {
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          patientName: 'John Doe',
          type: 'Check-up',
          description: 'Routine check-up',
        },
        {
          startTime: '10:30 AM',
          endTime: '11:30 AM',
          patientName: 'Jane Smith',
          type: 'Consultation',
          description: 'Consultation for .',
        },
        {
          startTime: '01:00 PM',
          endTime: '02:00 PM',
          patientName: 'Emily Johnson',
          type: 'Follow-up',
          description: 'Follow-up on recent surgery.',
        },
        {
          startTime: '02:30 PM',
          endTime: '03:30 PM',
          patientName: 'Michael Brown',
          type: 'Check-up',
          description: 'Routine check-up',
        },
      ];
      setSchedule(mockData);

      // Mock personal schedule data for testing
      const mockPersonalSchedule: PersonalScheduleItem[] = [
        {
          startTime: '11:00 AM',
          endTime: '12:00 PM',
          activity: 'Going out for lunch',
          description: 'Lunch break',
        },
        {
          startTime: '03:30 PM',
          endTime: '04:30 PM',
          activity: 'Meeting with team',
          description: 'Discuss project progress',
        },
      ];
      setPersonalSchedule(mockPersonalSchedule);
    }
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleUpdateSchedule = () => {
    // Add logic to update personal schedule here
    setShowUpdateForm(true);
  };

  const appointments = schedule.filter(item => item.type === 'Consultation' || item.type === 'Follow-up');
  const treatments = schedule.filter(item => item.type === 'Check-up');

  return (
    <div className="schedule p-8 bg-[#E6F0FF] min-h-screen"> 
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">Staff Schedule</h1>
        <div className="mb-6 flex items-center space-x-4">
          <label htmlFor="date" className="text-lg font-medium text-gray-700">Select Date:</label>
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
              <h2 className="text-2xl font-semibold mb-4 text-[#1F2B6C]">Personal Schedule on {selectedDate}</h2>
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1F2B6C] text-white">
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-300">Start Time</th>
                    <th className="py-3 px-4 border-b border-gray-300">End Time</th>
                    <th className="py-3 px-4 border-b border-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {personalSchedule.length > 0 ? (
                    personalSchedule.map((item, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <td className="py-3 px-4 border-b border-gray-300">{item.startTime}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{item.endTime}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{item.description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-4 text-center text-gray-500">No personal schedule for this date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-end w-full">
              <button
                onClick={handleUpdateSchedule}
                className="bg-[#1F2B6C] text-white py-2 px-4 rounded-lg mb-4 hover:scale-105 hover:shadow-lg"
              >
                Update Schedule
              </button>
            </div>
            {showUpdateForm && (
              <UpdateSchedule
                onClose={() => setShowUpdateForm(false)}
                // Pass other necessary props here
              />
            )}
          </div>
        </div>

        <div className="w-[60%]">
          <div className="grid grid-rows-1 lg:grid-rows-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-4 h-[300px] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4 text-[#1F2B6C]">Treatments on {selectedDate}</h2>
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1F2B6C] text-white">
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-300">Start Time</th>
                    <th className="py-3 px-4 border-b border-gray-300">End Time</th>
                    <th className="py-3 px-4 border-b border-gray-300">Patient</th>
                    <th className="py-3 px-4 border-b border-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.length > 0 ? (
                    treatments.map((treatment, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <td className="py-3 px-4 border-b border-gray-300">{treatment.startTime}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{treatment.endTime}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{treatment.patientName}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{treatment.description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-500">No treatments for this date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 h-[300px] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4 text-[#1F2B6C]">Appointments on {selectedDate}</h2>
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#1F2B6C] text-white">
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-300">Start Time</th>
                    <th className="py-3 px-4 border-b border-gray-300">End Time</th>
                    <th className="py-3 px-4 border-b border-gray-300">Patient</th>
                    <th className="py-3 px-4 border-b border-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <td className="py-3 px-4 border-b border-gray-300">{appointment.startTime}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{appointment.endTime}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{appointment.patientName}</td>
                        <td className="py-3 px-4 border-b border-gray-300">{appointment.description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-500">No appointments for this date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}
