"use client";
import React, { useState, useEffect } from 'react';

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedDate) {
      // Mock data for testing
      const mockData = [
        {
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          patientName: 'John Doe',
          type: 'Check-up',
          description: 'Routine check-up, no issues reported.',
        },
        {
          startTime: '10:30 AM',
          endTime: '11:30 AM',
          patientName: 'Jane Smith',
          type: 'Consultation',
          description: 'Consultation for ongoing treatment.',
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
          description: 'Routine check-up, no issues reported.',
        },
        // More mock data for testing
      ];
      setSchedule(mockData);
    }
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Separate appointments and treatments
  const appointments = schedule.filter(item => item.type === 'Consultation' || item.type === 'Follow-up');
  const treatments = schedule.filter(item => item.type === 'Check-up');

  return (
    <div className="schedule p-8 bg-[#E6F0FF] min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Staff Schedule</h1>

      <div className="mb-6 flex items-center space-x-4">
        <label htmlFor="date" className="text-lg font-medium text-gray-700">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {schedule.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Treatments Column */}
          <div className="bg-white rounded-lg shadow-lg p-4 h-[450px] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-[#1F2B6C]">Treatments on {selectedDate}</h2>
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1F2B6C] text-white">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-300">Time</th>
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
                      <td className="py-3 px-4 border-b border-gray-300">{treatment.startTime} - {treatment.endTime}</td>
                      <td className="py-3 px-4 border-b border-gray-300">{treatment.patientName}</td>
                      <td className="py-3 px-4 border-b border-gray-300">{treatment.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">No treatments for this date.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Appointments Column */}
          <div className="bg-white rounded-lg shadow-lg p-4 h-[450px] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-[#1F2B6C]">Appointments on {selectedDate}</h2>
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1F2B6C] text-white">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-300">Time</th>
                  <th className="py-3 px-4 border-b border-gray-300">Patient</th>
                  <th className="py-3 px-4 border-b border-gray-300">Purpose</th>
                  <th className="py-3 px-4 border-b border-gray-300">Notes</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="py-3 px-4 border-b border-gray-300">{appointment.startTime} - {appointment.endTime}</td>
                      <td className="py-3 px-4 border-b border-gray-300">{appointment.patientName}</td>
                      <td className="py-3 px-4 border-b border-gray-300">{appointment.type}</td>
                      <td className="py-3 px-4 border-b border-gray-300">{appointment.notes}</td>
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
      ) : (
        <p className="text-gray-500">No schedule for this date.</p>
      )}
    </div>
  );
}
