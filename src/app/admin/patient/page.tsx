"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Define a type for the patient data
type TreatmentHistory = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  status: "pending" | "completed" | "canceled";
};

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  allergies: string;
  password: string;
  treatmentHistory: TreatmentHistory[];
};

export default function Patient() {
  const [patientList, setPatientList] = useState<Patient[]>([]);
  const [filteredPatient, setFilteredPatient] = useState<Patient | null>(null);
  const [searchId, setSearchId] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);

        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(`http://localhost:8080/patient/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setPatientList(response.data.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setErrorMessage("Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = async () => {
    // const patient = patientList.find(p => p.id === searchId);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`http://localhost:8080/patient/?name=${searchId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("wewe");
      // console.log(response.data);
      setPatientList(response.data.data);
      // setFilteredPatient(response.data.data);
      setSuccessMessage("Patient found.");
      setErrorMessage(null);
    } catch (error) {
      setFilteredPatient(null);
      setErrorMessage("No patient found with the provided ID.");
    }

    // if (patient) {

    //     const accessToken = localStorage.getItem("accessToken");
    //     const response = await axios.get(`http://localhost:8080/patient/?name=${searchId}`, {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     });
    //     console.log("wewe")
    //     console.log(response.data)
    //     setFilteredPatient(response.data.data);
    //     setSuccessMessage('Patient found.');
    //     setErrorMessage(null);
    // } else {
    //     setFilteredPatient(null);
    //     setErrorMessage('No patient found with the provided ID.');
    // }
  };

  return (
    <main className="patient bg-[#E6F0FF] min-h-screen pt-4">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl mb-6 font-bold text-gray-900">Patient Database Management</h1>

        <div className="search-section mb-8">
          <label className="block text-lg mb-3 font-medium text-gray-700">Search Patient by Name or ID</label>
          <div className="search-field flex items-center space-x-4">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="px-4 py-2 border rounded-lg flex-1 text-black"
              placeholder="Enter Patient Name or ID"
            />
            <button
              onClick={handleSearch}
              className="bg-[#1F2B6C] text-white px-4 py-2 rounded-lg hover:bg-[#153C6B] transition-colors"
            >
              Search
            </button>
          </div>

         
        </div>
        <div className="patient-database-container bg-white rounded-lg shadow-lg mb-6 max-h-[400px] overflow-y-auto">
          <table className="rounded-md text-left w-full">
            <thead className="bg-[#1F2B6C] text-white">
              <tr>
                <th className="py-3 px-4 border-b">ID</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Phone</th>
                <th className="py-3 px-4 border-b">DOB</th>
                <th className="py-3 px-4 border-b">Address</th>
                <th className="py-3 px-4 border-b">Allergies</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                    Loading patients...
                  </td>
                </tr>
              ) : patientList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                    There are no patients yet!
                  </td>
                </tr>
              ) : (
                patientList.map((patient) => (
                  <tr key={patient.p_id} className="hover:bg-gray-100 transition-colors">
                    <td className="text-black py-2 px-4 border-b">{patient.p_id}</td>
                    <td className="text-black py-2 px-4 border-b">
                      {patient.users.Fname} {patient.users.Lname}
                    </td>
                    <td className="text-black py-2 px-4 border-b">{patient.users.email}</td>
                    <td className="text-black py-2 px-4 border-b">{patient.users.phone}</td>
                    <td className="text-black py-2 px-4 border-b">{patient.users.birth_date.slice(0,10)}</td>
                    <td className="text-black py-2 px-4 border-b">{patient.users.patients.address}</td>
                    <td className="text-black py-2 px-4 border-b">{patient.users.patients.allergies}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="patient-container">
          {/* Display Searched Patient */}
          {filteredPatient && (
            <div className="flex flex-col lg:flex-row gap-8 mt-6">
              <div className="patient-detail lg:w-1/3">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Patient Details</h2>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-gray-700 text-lg">
                    <strong>ID:</strong> {filteredPatient.p_id}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <strong>Name:</strong> {filteredPatient.firstName} {filteredPatient.lastName}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <strong>Email:</strong> {filteredPatient.email}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <strong>Phone:</strong> {filteredPatient.phone}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <strong>DOB:</strong> {filteredPatient.dob}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <strong>Address:</strong> {filteredPatient.address}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <strong>Allergies:</strong> {filteredPatient.allergies}
                  </p>
                </div>
              </div>

              {/* Treatment History */}
              <div className="treatment-detail lg:w-2/3">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Treatment History</h3>
                <div className="bg-white rounded-lg shadow-lg">
                  <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
                    {filteredPatient.treatmentHistory && filteredPatient.treatmentHistory.length > 0 ? (
                      <table className="w-full text-left border-collapse rounded-md">
                        <thead className="bg-[#1F2B6C] text-white">
                          <tr>
                            <th className="py-3 px-4 border-b">Date</th>
                            <th className="py-3 px-4 border-b">Time</th>
                            <th className="py-3 px-4 border-b">Doctor</th>
                            <th className="py-3 px-4 border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPatient.treatmentHistory.map((treatment) => (
                            <tr key={treatment.id} className="hover:bg-gray-100 transition-colors">
                              <td className="py-2 px-4 border-b">{treatment.date}</td>
                              <td className="py-2 px-4 border-b">{treatment.time}</td>
                              <td className="py-2 px-4 border-b">{treatment.doctor}</td>
                              <td
                                className={`py-2 px-4 border-b ${
                                  treatment.status === "completed"
                                    ? "text-green-500"
                                    : treatment.status === "canceled"
                                    ? "text-red-500"
                                    : treatment.status === "pending"
                                    ? "text-blue-500"
                                    : "text-gray-500"
                                }`}
                              >
                                {treatment.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-4 px-4 text-center text-gray-500">No treatment history available.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
