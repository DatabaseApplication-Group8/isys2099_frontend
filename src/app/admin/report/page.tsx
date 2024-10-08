"use client";
import React, { useState } from "react";
import axios from "axios";

// Define types for the reports
type TreatmentHistory = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  status: "pending" | "completed" | "canceled";
};

type JobChange = {
  staffId: string;
  changeDate: string;
  previousRole: string;
  newRole: string;
};

type DoctorWork = {
  doctorId: string;
  patientId: string;
  treatmentDate: string;
  treatmentId: string;
};


export default function AdminDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [staffId, setStaffId] = useState("");
  const [allPatientTreatments, setAllPatientTreatments] = useState<
    TreatmentHistory[]
  >([]);
  const [jobChangeHistory, setJobChangeHistory] = useState<JobChange[]>([]);
  const [doctorWork, setDoctorWork] = useState<DoctorWork[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState<{
    allPatientTreatments: boolean;
    doctorWork: boolean;
    jobChangeHistory: boolean;
  }>({
    allPatientTreatments: false,
    doctorWork: false,
    jobChangeHistory: false,
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  // Validate date range
  const validateDateRange = () => {
    if (!startDate || !endDate) {
      setDateRangeError("Both start date and end date are required.");
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setDateRangeError("End date must be after start date.");
      return false;
    }
    setDateRangeError(null);
    return true;
  };

  const filterDataByDateRange = (data: any[], dateKey: string) => {
    return data.filter((item) => {
      const itemDate = new Date(item[dateKey]);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
  };

  const fetchData = async (
    url: string,
    params: object,
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    dateKey: string,
    key: keyof typeof dataFetched
  ) => {
    try {
      const response = await axios.get(url, { params });
      const filteredData = filterDataByDateRange(response.data, dateKey);
      setter(filteredData);
      setDataFetched((prev) => ({ ...prev, [key]: true }));
      setErrorMessage(null);
    } catch (error) {
      //setErrorMessage(`Error fetching data from ${url}.`);
    }
  };

  const handleViewAllPatientTreatments = async () => {
    if (!validateDateRange()) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/treatment/by-date-range/${startDate}/${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("All Patient Treatments:", response.data);
      setAllPatientTreatments(response.data);
      setDataFetched((prev) => ({ ...prev, allPatientTreatments: true }));
    } catch (error) {
      setErrorMessage("Error fetching patient treatments.");
    }
  };


  const handleViewDoctorWork = async () => {
    if (!validateDateRange()) return;

    const response = await axios.get(
      `http://localhost:8080/treatment/by-date-range/${startDate}/${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    console.log(response.data);
    setDoctorWork(response.data);
    console.log(doctorWork.length);
  };


  const handleViewJobChangeHistory = async () => {
    if (!staffId) {
      setErrorMessage("Staff ID is required.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/jobs/find-jobs-history-by-s_id/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setJobChangeHistory(response.data);
      setErrorMessage(null);
      setDataFetched((prev) => ({ ...prev, jobChangeHistory: true }));
    } catch (error) {
      setErrorMessage("Error fetching job change history.");
    }
  };

  return (
    <main className="admin-dashboard bg-[#E6F0FF] min-h-screen pt-4">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl mb-6 font-bold text-gray-900">
          Report Generate
        </h1>

        <div className="flex flex-row gap-12 ">
          <div className="filter-section w-2/3 bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Filter by given duration
            </h2>
            {dateRangeError && (
              <div className="text-red-500 mb-2 text-end">{dateRangeError}</div>
            )}
            <div className="flex flex-row gap-4">
              <input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 border rounded-lg flex-1 text-black"
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
            <div className="flex flex-row actions space-x-10 full mt-6">
              <button className="w-full bg-[#1F2B6C] text-white px-4 py-2 rounded-lg hover:bg-[#153C6B] transition-colors"
                onClick={handleViewAllPatientTreatments}>
                View All Patient Treatments
              </button>
              <button className="w-full bg-[#1F2B6C] text-white px-4 py-2 rounded-lg hover:bg-[#153C6B] transition-colors"
                onClick={handleViewDoctorWork}>
                View Doctor Work
              </button>
            </div>
          </div>

          <div className="filter-section w-1/3 bg-white p-6 rounded-lg shadow-lg mb-6 flex flex-col justify-between">
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Filter by Staff ID
              </h2>
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="px-4 py-2 border rounded-lg flex-1 text-black"
                placeholder="Staff ID"
              />
            </div>

            <div className="w-full flex justify-center">
              <button className="w-full bg-[#1F2B6C] text-white px-4 py-2 rounded-lg hover:bg-[#153C6B] transition-colors"
                onClick={handleViewJobChangeHistory}>
                View Job Change History
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-500 mb-6 text-center">{errorMessage}</div>
        )}

        {dataFetched.allPatientTreatments && allPatientTreatments.length === 0 && startDate && endDate && (
          <div className="text-gray-500 mb-6 text-center">
            No treatments found for the selected date range.
          </div>
        )}

        {doctorWork && doctorWork.length === 0 && (
          <div className="text-gray-500 mb-6 text-center">
            No doctor work records found for the selected date range.
          </div>
        )}
        {dataFetched.jobChangeHistory &&
          jobChangeHistory.length === 0 &&
          staffId && (
            <div className="text-gray-500 mb-6 text-center">
              No job change history found for the given staff ID.
            </div>
          )}

        {allPatientTreatments.length > 0 && (
          <div className="bg-white p-6 text-black mb-6 mt-4 shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              All Patient Treatments
            </h2>
            <table className="border-2 border-solid border-[#1F2B6C] bg-white rounded-md text-left w-full">
              <thead className="bg-[#1F2B6C] text-white">
                <tr>
                  <th className="py-3 px-4 border-b">Treatment Id</th>
                  <th className="py-3 px-4 border-b">Patient Id</th>
                  <th className="py-3 px-4 border-b">Doctor Id</th>
                  <th className="py-3 px-4 border-b">Description</th>
                  <th className="py-3 px-4 border-b">Treatment Date</th>
                  <th className="py-3 px-4 border-b">Start Time</th>
                  <th className="py-3 px-4 border-b">End Time</th>
                  <th className="py-3 px-4 border-b">Billing</th>
                </tr>
              </thead>
              <tbody>
                {allPatientTreatments.map((treatment) => (
                  <tr key={treatment.id}>
                    <td className="py-2 px-4 border-b">{treatment.t_id}</td>
                    <td className="py-2 px-4 border-b">{treatment.p_id}</td>
                    <td className="py-2 px-4 border-b">{treatment.doctor_id}</td>
                    <td className="py-2 px-4 border-b">{treatment.description}</td>
                    <td className="py-2 px-4 border-b">
                      {formatDate(treatment.treatment_date)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {formatTime(treatment.start_time)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {formatTime(treatment.end_time)}
                    </td>
                    <td className="py-2 px-4 border-b">{treatment.billing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {doctorWork.length > 0 && (
          <div className="bg-white p-6 text-black mb-6 mt-4 shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Doctor Work Report
            </h2>
            <table className="border-2 border-solid border-[#1F2B6C] bg-white rounded-md text-left w-full">
              <thead className="bg-[#1F2B6C] text-white">
                <tr>
                  <th className="py-3 px-4 border-b">Doctor Id</th>
                  <th className="py-3 px-4 border-b">Patient Id</th>
                  <th className="py-3 px-4 border-b">Treatment Date</th>
                  <th className="py-3 px-4 border-b">Treatment ID</th>
                </tr>
              </thead>
              <tbody>
                {doctorWork.map((treatment) => (
                  <tr key={treatment.id}>
                    <td className="py-2 px-4 border-b">{treatment.doctor_id}</td>
                    <td className="py-2 px-4 border-b">{treatment.p_id}</td>
                    <td className="py-2 px-4 border-b">
                      {formatDate(treatment.treatment_date)}
                    </td>
                    <td className="py-2 px-4 border-b">{treatment.t_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {jobChangeHistory.length > 0 && (
          <div className="bg-white p-6 text-black mb-6 mt-4 shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Job Change History
            </h2>
            <table className="border-2 border-solid border-[#1F2B6C] bg-white rounded-md text-left w-full">
              <thead className="bg-[#1F2B6C] text-white">
                <tr>
                  <th className="py-3 px-4 border-b">Staff ID</th>
                  <th className="py-3 px-4 border-b">Date Change</th>
                  <th className="py-3 px-4 border-b">Previous Job</th>
                  <th className="py-3 px-4 border-b">New Job</th>
                </tr>
              </thead>
              <tbody>
                {jobChangeHistory
                  // Sort by start_date to ensure the order is correct for processing
                  .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
                  // Reduce the array to pairs of job history entries
                  .reduce((acc, curr, index, src) => {
                    if (index > 0) {
                      // Skip the first entry because it can't form a pair with a previous one
                      const prev = src[index - 1];
                      if (prev.s_id === curr.s_id) {
                        // Ensure it's the same staff
                        acc.push({
                          staffId: curr.s_id,
                          changeDate: curr.start_date, // Date of the current entry
                          previousRole: prev.jobs.job_title, // Role from the previous entry
                          newRole: curr.jobs.job_title, // Role from the current entry
                        });
                      }
                    }
                    return acc;
                  }, [])
                  .map((entry, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{entry.staffId}</td>
                      <td className="py-2 px-4 border-b">{formatDate(entry.changeDate)}</td>
                      <td className="py-2 px-4 border-b">{entry.previousRole}</td>
                      <td className="py-2 px-4 border-b">{entry.newRole}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

          </div>
        )}
      </div>
    </main>
  );

}
