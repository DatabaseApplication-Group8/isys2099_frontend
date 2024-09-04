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
          notes: 'Routine check-up, no issues reported.',
        },
        {
          startTime: '10:30 AM',
          endTime: '11:30 AM',
          patientName: 'Jane Smith',
          type: 'Consultation',
          notes: 'Consultation for ongoing treatment.',
        },
        {
          startTime: '01:00 PM',
          endTime: '02:00 PM',
          patientName: 'Emily Johnson',
          type: 'Follow-up',
          notes: 'Follow-up on recent surgery.',
        },
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
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Staff Schedule</h1>

      <div className="mb-6">
        <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-2">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {schedule.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments Column */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Appointments for {selectedDate}</h2>
              <ul className="list-none p-0">
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <li key={index} className="mb-4 p-4 border-b border-gray-200">
                      <div className="text-lg font-medium mb-2">
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                      <div className="text-gray-700">
                        <strong className="font-semibold">Patient:</strong> {appointment.patientName}<br />
                        <strong className="font-semibold">Notes:</strong> {appointment.notes}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No appointments for this date.</p>
                )}
              </ul>
            </div>

            {/* Treatments Column */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Treatments for {selectedDate}</h2>
              <ul className="list-none p-0">
                {treatments.length > 0 ? (
                  treatments.map((treatment, index) => (
                    <li key={index} className="mb-4 p-4 border-b border-gray-200">
                      <div className="text-lg font-medium mb-2">
                        {treatment.startTime} - {treatment.endTime}
                      </div>
                      <div className="text-gray-700">
                        <strong className="font-semibold">Patient:</strong> {treatment.patientName}<br />
                        <strong className="font-semibold">Notes:</strong> {treatment.notes}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No treatments for this date.</p>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No schedule for this date.</p>
        )}
      </div>
    </div>
  );
}
