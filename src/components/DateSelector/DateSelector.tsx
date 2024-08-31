import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DOBSelector: React.FC = () => {
    const [dob, setDob] = useState<Date | null>(null);

    const handleDateChange = (date: Date | null) => {
        setDob(date);
    };

    return (
        <div className="dob-selector">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                Date of Birth:
            </label>
            <DatePicker
                selected={dob}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select your date of birth"
                className="border p-2 rounded w-full"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100} // This will show 100 years in the dropdown
                maxDate={new Date()} // Prevents selecting a future date
            />
            {dob && (
                <div className="mt-4">
                    <strong>Selected Date of Birth:</strong> {dob.toDateString()}
                </div>
            )}
        </div>
    );
};

export default DOBSelector;
