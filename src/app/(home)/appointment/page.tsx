"use client";
import { useState, useEffect } from 'react';
import "./appointment.scss";

export default function Appointment() {
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        doctor: '',
        note: ''
    });

    const [timeConstraints, setTimeConstraints] = useState({
        minTime: ''
    });

    const [dateConstraints, setDateConstraints] = useState({
        minDate: '',
        maxDate: ''
    });

    useEffect(() => {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];

        // Set the maximum date to 2 weeks from today
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 14);
        const maxDateString = maxDate.toISOString().split('T')[0];

        setDateConstraints({
            minDate,
            maxDate: maxDateString
        });

        // Get current time in HH:MM format
        const now = new Date();
        const minTime = now.toTimeString().split(' ')[0].slice(0, 5); // Extract HH:MM

        setTimeConstraints({
            minTime
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => {
            const newData = {
                ...prevData,
                [id]: value
            };

            // Update end time constraints based on start time
            if (id === 'startTime') {
                const startTime = new Date(`${newData.date}T${value}`);
                const minEndTime = startTime.toISOString().split('T')[1].slice(0, 5);

                // Ensure end time is always after start time
                if (newData.endTime <= minEndTime) {
                    newData.endTime = minEndTime;
                }

                return { ...newData, minEndTime };
            }

            return newData;
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Validate time inputs
        const startTime = new Date(`${formData.date}T${formData.startTime}`);
        const endTime = new Date(`${formData.date}T${formData.endTime}`);

        if (endTime <= startTime) {
            alert('End time must be after start time.');
            return;
        }

        // Handle form submission logic here
        console.log('Form submitted with data:', formData);
    };

    return (
        <div className="appointment min-h-screen flex flex-col bg-[#F5F8FF]">
            <main className="flex flex-col flex-grow bg-white p-8 justify-center items-center">
                <div className="container px-[70px] py-12 max-w-2xl rounded-lg bg-[#BFD2F8] bg-opacity-[50%] shadow-lg">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-3xl font-bold text-[#1F2B6C]">Make an Appointment</h1>
                    </div>

                    <form className="container-content grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="date" className="text-sm font-semibold text-[#1F2B6C]">Choose a date</label>
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

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="startTime" className="text-sm font-semibold text-[#1F2B6C]">Start time</label>
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

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="endTime" className="text-sm font-semibold text-[#1F2B6C]">End time</label>
                            <input
                                required
                                type="time"
                                id="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                min={formData.startTime || timeConstraints.minTime}
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="doctor" className="text-sm font-semibold text-[#1F2B6C]">Select Doctor</label>
                            <div className='relative'>
                                <select
                                    id="doctor"
                                    value={formData.doctor}
                                    onChange={handleChange}
                                    className="p-3 w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] bg-white appearance-none"
                                >
                                    <option value="">Select Doctor</option>
                                    <option value="doctor1">Doctor 1</option>
                                    <option value="doctor2">Doctor 2</option>
                                </select>
                                <div className="absolute inset-y-0 right-[1rem] flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="note" className="text-sm font-semibold text-[#1F2B6C]">Add note</label>
                            <input
                                type="text"
                                id="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Add your note"
                                className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="h-[45px] w-full mt-4 border-solid border-[3px] border-[#C5DCFF] rounded-md
                                        text-[#1F2B6C] bg-white items-center justify-center
                                        hover:bg-[#1F2B6C] hover:text-white hover:border-0
                                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Make an Appointment
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="h-[45px] w-full border-solid border-[3px] border-[#C5DCFF] rounded-md
                                        text-[#1F2B6C] bg-white items-center justify-center
                                        hover:bg-[#1F2B6C] hover:text-white hover:border-0
                                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                View Appointment
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
