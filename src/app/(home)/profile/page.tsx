"use client";
import Link from 'next/link';
import { useUserContext } from "@/app/context";
import { useEffect, useState } from 'react';
import axios from 'axios';
import AppointmentStatusModal from '@/components/AppointmentStatusModal/page';
import TreatmentStatusModal from '@/components/TreatmentStatusModal/page';

type Treatment = {
    id: string;
    date: string;
    time: string;
    doctor: string;
    status: 'pending' | 'completed' | 'canceled';
};

type Appointment = {
    id: string;
    date: string;
    startTime: string;
    staff: string;
    status: 'pending' | 'completed' | 'canceled';
};

export default function Profile() {
    const { user, setUser } = useUserContext();
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
    const [currentItemId, setCurrentItemId] = useState<string | null>(null);
    const [currentItemType, setCurrentItemType] = useState<'appointment' | 'treatment' | null>(null);

    const handleLogout = () => {
        localStorage.clear();
        setUser({
            username: "",
            role: "",
            email: "",
            id: "",
        });
        window.location.href = "/";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [treatmentResponse, appointmentResponse] = await Promise.all([
                    axios.post('/api/treatments'),
                    axios.post('/api/appointments')
                ]);
                setTreatments(treatmentResponse.data);
                setAppointments(appointmentResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const openModal = (id: string, type: 'appointment' | 'treatment') => {
        setCurrentItemId(id);
        setCurrentItemType(type);
        if (type === 'appointment') {
            setIsAppointmentModalOpen(true);
        } else {
            setIsTreatmentModalOpen(true);
        }
    };

    const closeModal = () => {
        setCurrentItemId(null);
        setCurrentItemType(null);
        setIsAppointmentModalOpen(false);
        setIsTreatmentModalOpen(false);
    };

    const confirmCancellation = async () => {
        if (currentItemId && currentItemType) {
            try {
                if (currentItemType === 'appointment') {
                    await axios.post('/api/appointments/cancel', { id: currentItemId });
                    setAppointments(prevAppointments =>
                        prevAppointments.map(appointment =>
                            appointment.id === currentItemId ? { ...appointment, status: 'canceled' } : appointment
                        )
                    );
                } else {
                    await axios.post('/api/treatments/cancel', { id: currentItemId });
                    setTreatments(prevTreatments =>
                        prevTreatments.map(treatment =>
                            treatment.id === currentItemId ? { ...treatment, status: 'canceled' } : treatment
                        )
                    );
                }
            } catch (error) {
                console.error("Error canceling item:", error);
            } finally {
                closeModal();
            }
        }
    };

    return (
        <main className="profile min-h-screen bg-[#E6F0FF] py-8">
            <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-10">
                {/* Personal Profile Section */}
                <div className="lg:w-1/3 mt-1">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900">Patient Personal Profile</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p className="text-gray-700 text-lg"><strong>Username:</strong> {user.username}</p>
                        <p className="text-gray-700 text-lg"><strong>Email:</strong> {user.email}</p>
                        <p className="text-gray-700 text-lg"><strong>Role:</strong> {user.role}</p>
                    </div>
                    <div className='flex justify-end mt-4'>
                        <button
                            onClick={handleLogout}
                            className="h-11 w-32 border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center
                            hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Log Out"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Treatment and Appointment Sections */}
                <div className="lg:w-2/3 flex flex-col gap-6">
                    <div className='treatment'>
                        <div className='flex flex-row mb-4 items-center justify-between'>
                            <h2 className="text-3xl font-semibold text-gray-900">Treatment</h2>
                            <div>
                                <Link href={"/treatment"}>
                                    <button className='h-11 px-3 border border-[#C5DCFF] rounded-md
                                            bg-[#1F2B6C] text-white
                                            hover:bg-[#1D3F7F] hover:shadow-lg
                                            focus:outline-none focus:ring-2 focus:ring-blue-50'>
                                        Book Treatment
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="treatment-container bg-white rounded-lg shadow-lg overflow-y-auto">
                            <table className="w-full text-left h-72">
                                <thead className="bg-[#1F2B6C] text-white">
                                    <tr>
                                        <th className="py-2 px-4 border-b">Date</th>
                                        <th className="py-2 px-4 border-b">Time</th>
                                        <th className="py-2 px-4 border-b">Doctor</th>
                                        <th className="py-2 px-4 border-b">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {treatments.length > 0 ? (
                                        treatments.map((treatment) => (
                                            <tr key={treatment.id}>
                                                <td className="py-2 px-4 border-b">{treatment.date}</td>
                                                <td className="py-2 px-4 border-b">{treatment.time}</td>
                                                <td className="py-2 px-4 border-b">{treatment.doctor}</td>
                                                <td className="py-2 px-4 border-b">
                                                    {treatment.status === 'pending' ? (
                                                        <button
                                                            onClick={() => openModal(treatment.id, 'treatment')}
                                                            className="text-blue-500 hover:underline hover:text-blue-700"
                                                        >
                                                            {treatment.status}
                                                        </button>
                                                    ) : (
                                                        <span className={`${treatment.status === 'canceled' ? 'text-red-500' : 'text-green-500'}`}>
                                                            {treatment.status}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-2 px-4 text-center text-gray-500">
                                                There are no treatments yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='appointment'>
                        <div className='flex flex-row mb-4 items-center justify-between'>
                            <h2 className="text-3xl font-semibold text-gray-900">Appointment</h2>
                            <div>
                                <Link href={"/appointment"}>
                                    <button className='h-11 px-3 border border-[#C5DCFF] rounded-md
                                            bg-[#1F2B6C] text-white
                                            hover:bg-[#1D3F7F] hover:shadow-lg
                                            focus:outline-none focus:ring-2 focus:ring-blue-50'>
                                        Make an Appointment
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="appointment-container bg-white rounded-lg shadow-lg overflow-y-auto">
                            <table className="w-full text-left h-72">
                                <thead className="bg-[#1F2B6C] text-white">
                                    <tr>
                                        <th className="py-2 px-4 border-b">Date</th>
                                        <th className="py-2 px-4 border-b">Start Time</th>
                                        <th className="py-2 px-4 border-b">Staff</th>
                                        <th className="py-2 px-4 border-b">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.length > 0 ? (
                                        appointments.map((appointment) => (
                                            <tr key={appointment.id}>
                                                <td className="py-2 px-4 border-b">{appointment.date}</td>
                                                <td className="py-2 px-4 border-b">{appointment.startTime}</td>
                                                <td className="py-2 px-4 border-b">{appointment.staff}</td>
                                                <td className="py-2 px-4 border-b">
                                                    {appointment.status === 'pending' ? (
                                                        <button
                                                            onClick={() => openModal(appointment.id, 'appointment')}
                                                            className="text-blue-500 hover:underline hover:text-blue-700"
                                                        >
                                                            {appointment.status}
                                                        </button>
                                                    ) : (
                                                        <span className={`${appointment.status === 'canceled' ? 'text-red-500' : 'text-green-500'}`}>
                                                            {appointment.status}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-2 px-4 text-center text-gray-500">
                                                There are no appointments yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isAppointmentModalOpen && currentItemType === 'appointment' && (
                <AppointmentStatusModal
                    isOpen={isAppointmentModalOpen}
                    onClose={closeModal}
                    onConfirmCancellation={confirmCancellation}
                />
            )}
            {isTreatmentModalOpen && currentItemType === 'treatment' && (
                <TreatmentStatusModal
                    isOpen={isTreatmentModalOpen}
                    onClose={closeModal}
                    onConfirmCancellation={confirmCancellation}
                />
            )}
        </main>
    );
}
