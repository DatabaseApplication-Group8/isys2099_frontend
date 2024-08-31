"use client";
import { useState, useEffect } from 'react';

export default function Treatment() {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        doctor: ''
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
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted with data:', formData);
    };

    return (
        <div className="treatment min-h-screen flex flex-col bg-[#F5F8FF]">
            <main className="treatment flex flex-col flex-grow bg-white p-8 justify-center items-center">
                <div className="container px-[70px] py-12 max-w-2xl rounded-lg bg-[#BFD2F8] bg-opacity-[50%] shadow-lg">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-3xl font-bold text-[#1F2B6C]">Book Treatment</h1>
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
                            <label htmlFor="time" className="text-sm font-semibold text-[#1F2B6C]">Choose a time</label>
                            <input
                                required
                                type="time"
                                id="time"
                                value={formData.time}
                                onChange={handleChange}
                                min={timeConstraints.minTime}
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

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="h-[45px] w-full mt-4 border-solid border-[3px] border-[#C5DCFF] rounded-md
                                        text-[#1F2B6C] bg-white items-center justify-center
                                        hover:bg-[#1F2B6C] hover:text-white hover:border-0
                                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Book Treatment
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                // Add functionality for View Treatment button if needed
                                className="h-[45px] w-full border-solid border-[3px] border-[#C5DCFF] rounded-md
                                        text-[#1F2B6C] bg-white items-center justify-center
                                        hover:bg-[#1F2B6C] hover:text-white hover:border-0
                                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                View Treatment
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
