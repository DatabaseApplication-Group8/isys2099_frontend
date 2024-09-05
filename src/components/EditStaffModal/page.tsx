import React, { useState } from 'react';
import axios from 'axios';

interface Staff {
  lastName: string;
  mInit: string;
  firstName: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  job: string;
  qualification: string;
  salary: number;
}

interface EditStaffModalProps {
  staff: Staff;
  onClose: () => void;
  onUpdate: (updatedData: Staff) => void;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({ staff, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<Staff>(staff);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put('http://localhost:8080/staff/profile?id=${id}', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onUpdate(formData);
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage('Failed to update profile.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Edit Staff Profile</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData).map(key => (
              <div key={key} className="flex flex-col space-y-2">
                <label htmlFor={key} className="text-sm font-semibold text-[#1F2B6C] capitalize">{key}</label>
                <input
                  type={key === 'dob' ? 'date' : 'text'}
                  id={key}
                  name={key}
                  value={formData[key as keyof Staff]}
                  onChange={handleChange}
                  className="p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2B6C]"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4 space-x-4">
            <button
              type="submit"
              className="h-11 w-[135px] rounded-full text-white bg-[#1F2B6C] flex items-center justify-center hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-11 w-32 border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;
