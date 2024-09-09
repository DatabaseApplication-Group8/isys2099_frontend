"use client";
import Link from "next/link";
import { useUserContext } from "@/app/context";
import { useEffect, useState } from "react";
import axios from "axios";
import AppointmentStatusModal from "@/components/AppointmentStatusModal/page";
import TreatmentStatusModal from "@/components/TreatmentStatusModal/page";

type Treatment = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  description: string;
  status: "pending" | "completed" | "canceled";
};

export default function Profile() {
  const { user, setUser } = useUserContext();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [allPatientTreatments, setAllPatientTreatments] = useState<TreatmentHistory[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [currentItemType, setCurrentItemType] = useState<"appointment" | "treatment" | null>(null);
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState<{ allPatientTreatments: boolean }>({
    allPatientTreatments: false,
  });

  // Validate date range
  const validateDateRange = () => {
    if (!startDate || !endDate) {
      setDateRangeError('Both start date and end date are required.');
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setDateRangeError('End date must be after start date.');
      return false;
    }
    setDateRangeError(null);
    return true;
  };

  const filterDataByDateRange = (data: any[], dateKey: string) => {
    return data.filter(item => {
      const itemDate = new Date(item[dateKey]);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
  };

  const fetchData = async (url: string, params: object, setter: React.Dispatch<React.SetStateAction<any[]>>, dateKey: string, key: keyof typeof dataFetched) => {
    try {
      const response = await axios.get(url, { params });
      const filteredData = filterDataByDateRange(response.data, dateKey);
      setter(filteredData);
      setDataFetched(prev => ({ ...prev, [key]: true }));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(`Error fetching data from ${url}.`);
    }
  };

  const handleViewPatientHistory = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!validateDateRange()) return;
    try {
        const treatment = await axios.post(`http://localhost:8080/treatment/patient/duration`,{
            p_id: parseInt(user.id),
            start_date: new Date(startDate),
            end_date: new Date(endDate)
        } ,{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTreatments(treatment.data);
    } catch (error) {
        console.log(error);
    }

    // await fetchData('/api/patient-treatment-history', { startDate, endDate }, setPatientTreatmentHistory, 'date', 'patientTreatmentHistory');
  };

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
        const accessToken = localStorage.getItem("accessToken");
        const id = localStorage.getItem("id");

        const appointment = await axios.get(`http://localhost:8080/appointment/patient?id=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAppointments(appointment.data);

        const treatment = await axios.get(`http://localhost:8080/treatment/patient?id=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTreatments(treatment.data);

        // const [treatmentResponse, appointmentResponse] = await Promise.all([
        //   axios.post("/api/treatments"),
        //   axios.get(`http://localhost:8080/appointment/patient?id=${id}`, {
        //     headers: {
        //       Authorization: `Bearer ${accessToken}`,
        //     },
        //   }),
        // ]);
        // console.log(appointmentResponse.data);
        // setTreatments(treatmentResponse.data);
        // setAppointments(appointmentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const openModal = (id: number, type: "appointment" | "treatment") => {
    setCurrentItemId(id);
    setCurrentItemType(type);
    if (type === "appointment") {
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
        const accessToken = localStorage.getItem("accessToken");
        const id = localStorage.getItem("id");
        if (currentItemType === "appointment") {
          await axios.patch(
            "http://localhost:8080/appointment/",
            { id: currentItemId },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment.appointment_id === currentItemId ? { ...appointment, status: "canceled" } : appointment
            )
          );
          const appointment = await axios.get(`http://localhost:8080/appointment/patient?id=${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setAppointments(appointment.data);
        } else {
          await axios.post("/api/treatments/cancel", { id: currentItemId });
          setTreatments((prevTreatments) =>
            prevTreatments.map((treatment) =>
              treatment.id === currentItemId ? { ...treatment, status: "canceled" } : treatment
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
      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        {/* Personal Profile Section */}
        <div className="lg:w-[50%] mt-1">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">Patient Personal Profile</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-700 text-lg">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Role:</strong> {user.role}
              {user.role === 3
                ? " - Patient"
                : user.role === 2
                ? " - Staff"
                : user.role === 1
                ? " - Admin"
                : "Unknown Role"}
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleLogout}
              className="h-11 w-32 border-2 border-[#C5DCFF] rounded-full text-[#1F2B6C] bg-white flex items-center justify-center
                            hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Log Out"
            >
              Log Out
            </button>
          </div>

          <div className="appointment">
            <div className="flex flex-row mb-4 items-center justify-between">
              <h2 className="text-3xl font-semibold text-gray-900">Appointment</h2>
            </div>
            <div className="appointment-container bg-white rounded-lg shadow-lg overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1F2B6C] text-white">
                  <tr>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Start Time</th>
                    <th className="py-2 px-4 border-b">End Time</th>
                    <th className="py-2 px-4 border-b">Staff</th>
                    <th className="py-2 px-4 border-b">Location</th>
                    <th className="py-2 px-4 border-b">Purpose</th>
                    <th className="py-2 px-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <tr key={appointment.appointment_id}>
                        <td className="py-2 px-4 border-b text-black">{appointment.meeting_date.slice(0, 10)}</td>
                        <td className="py-2 px-4 border-b text-black">{appointment.start_time.slice(11, 16)}</td>
                        <td className="py-2 px-4 border-b text-black">{appointment.end_time.slice(11, 16)}</td>
                        <td className="py-2 px-4 border-b text-black">{appointment.staff.users.Fname}</td>
                        <td className="py-2 px-4 border-b text-black">{appointment.location}</td>
                        <td className="py-2 px-4 border-b text-black">{appointment.purpose}</td>
                        <td className="py-2 px-4 border-b text-black">
                          {appointment.meeting_status === true ? (
                            new Date(appointment.meeting_date) >
                            new Date(new Date().setDate(new Date().getDate() - 1)) ? (
                              <button
                                onClick={() => openModal(appointment.appointment_id, "appointment")}
                                className="text-blue-500 hover:underline hover:text-blue-700"
                              >
                                Active
                              </button>
                            ) : (
                              <span className="text-green-500">Done</span>
                            )
                          ) : (
                            <span className="text-red-500">Cancelled</span>
                          )}
                        </td>
                        {/* <td className="py-2 px-4 border-b text-black">
                            {appointment.status === "pending" ? (
                              <button
                                onClick={() => openModal(appointment.appointment_id, "appointment")}
                                className="text-blue-500 hover:underline hover:text-blue-700"
                              >
                                {appointment.status}
                              </button>
                            ) : (
                              <span
                                className={`${appointment.status === "canceled" ? "text-red-500" : "text-green-500"}`}
                              >
                                {appointment.status}
                              </span>
                            )}
                          </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                        There are no appointments yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Link href={"/appointment"}>
                <button
                  className="h-11 px-3 border border-[#C5DCFF] rounded-md
                                            bg-[#1F2B6C] text-white
                                            hover:shadow-lg hover:scale-110 transition-all duration-300
                                            focus:outline-none focus:ring-2 focus:ring-blue-50"
                >
                  Make an Appointment
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:w-[50%] flex flex-col gap-6">
          <div className="filter-section bg-white p-6 rounded-lg shadow-lg mb-2">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Filter by given duration</h2>
            {dateRangeError && <div className="text-red-500 mb-2 text-end">{dateRangeError}</div>}
            <div className="flex flex-row gap-4">
              <input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[50px] px-4 py-2 border rounded-lg flex-1 text-black"
                placeholder="Start Date"
              />
              <input
                required
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border rounded-lg flex-1 text-black"
                placeholder="End Date"
              />
            </div>
            <div className="flex flex-row actions mt-6 space-x-6 justify-end">
              <button
                className="bg-[#1F2B6C] text-white px-4 py-2 rounded-lg hover:bg-[#153C6B] transition-colors"
                onClick={handleViewPatientHistory}
              >
                View Patient Treatment History
              </button>
            </div>
          </div>
          <div className="treatment">
            <div className="flex flex-row space-x-4 mb-4 items-center justify-between">
              <h2 className="text-3xl font-semibold text-gray-900">Treatment</h2>
            </div>
            <div className="treatment-container bg-white rounded-lg shadow-lg overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1F2B6C] text-white">
                  <tr>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Start Time</th>
                    <th className="py-2 px-4 border-b">End Time</th>
                    <th className="py-2 px-4 border-b">Doctor</th>
                    <th className="py-2 px-4 border-b">Description</th>
                    <th className="py-2 px-4 border-b">Billing</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.length > 0 ? (
                    treatments.map((treatment) => (
                      <tr key={treatment.t_id}>
                        <td className="py-2 px-4 border-b text-black">{treatment.treatment_date.slice(0, 10)}</td>
                        <td className="py-2 px-4 border-b text-black">{treatment.start_time.slice(11, 16)}</td>
                        <td className="py-2 px-4 border-b text-black">{treatment.end_time.slice(11, 16)}</td>
                        <td className="py-2 px-4 border-b text-black">{treatment.staff.users.Fname}</td>
                        <td className="py-2 px-4 border-b text-black">{treatment.description}</td>
                        <td className="py-2 px-4 border-b text-red-500">{treatment.billing} $</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-2 px-4 text-center text-gray-500">
                        There are no treatments yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Link href={"/treatment"}>
                <button
                  className="h-11 px-3 border border-[#C5DCFF] rounded-md
                                            bg-[#1F2B6C] text-white
                                            hover:shadow-lg hover:scale-110 transition-all duration-300
                                            focus:outline-none focus:ring-2 focus:ring-blue-50"
                >
                  Book Treatment
                </button>
              </Link>
            </div>
          </div>

          {/*appoinment*/}
        </div>
      </div>

      {isAppointmentModalOpen && currentItemType === "appointment" && (
        <AppointmentStatusModal
          isOpen={isAppointmentModalOpen}
          onClose={closeModal}
          onConfirmCancellation={confirmCancellation}
        />
      )}
      {isTreatmentModalOpen && currentItemType === "treatment" && (
        <TreatmentStatusModal
          isOpen={isTreatmentModalOpen}
          onClose={closeModal}
          onConfirmCancellation={confirmCancellation}
        />
      )}
    </main>
  );
}
