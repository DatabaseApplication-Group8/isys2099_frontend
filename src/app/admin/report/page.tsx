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
  const [allPatientTreatments, setAllPatientTreatments] = useState<TreatmentHistory[]>([]);
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
      setErrorMessage(`Error fetching data from ${url}.`);
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
    try {
      const response = await axios.get(
        `http://localhost:8080/treatment/by-date-range/${startDate}/${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("Doctor Work:", response.data);
      setDoctorWork(response.data);
      setDataFetched((prev) => ({ ...prev, doctorWork: true }));
    } catch (error) {
      setErrorMessage("Error fetching doctor work.");
    }
  };

  {/*const handleViewJobChangeHistory = async () => {
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

      console.log("Job Change History:", jobChangeHistory);


      const sortedAndReducedHistory = response.data
        .sort((a: any, b: any) => new Date(a.start_date) - new Date(b.start_date))
        .reduce((acc: JobChange[], curr: any, index: number, src: any[]) => {
          if (index > 0) {
            const prev = src[index - 1];
            if (prev.s_id === curr.s_id) {
              acc.push({
                staffId: curr.s_id,
                changeDate: curr.start_date,
                previousRole: prev.jobs.job_title,
                newRole: curr.jobs.job_title,
              });
            }
          }
          return acc;
        }, []);

      console.log("Sorted and Reduced Job Change History:", sortedAndReducedHistory);
      setJobChangeHistory(sortedAndReducedHistory);
      setErrorMessage(null);
      setDataFetched((prev) => ({ ...prev, jobChangeHistory: true }));
    } catch (error) {
      setErrorMessage("Error fetching job change history.");
    }
  };*/}

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

      console.log('Original jobChangeHistory:', jobChangeHistory);
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
              <button className="w-full bg-[#1F2B6C] text-white px-4 py-2 rounded-lg hover:bg-[#153C6B] transition-colors mt-6"
                onClick={handleViewJobChangeHistory}>
                View Job Change History
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-500 mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <div className="tables-container">
          {dataFetched.allPatientTreatments && allPatientTreatments.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                All Patient Treatments
              </h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allPatientTreatments.map((treatment) => (
                    <tr key={treatment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{treatment.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(treatment.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(treatment.time)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{treatment.doctor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{treatment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {dataFetched.doctorWork && doctorWork.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Doctor Work
              </h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctorWork.map((work) => (
                    <tr key={work.treatmentId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{work.doctorId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{work.patientId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(work.treatmentDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{work.treatmentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {dataFetched.jobChangeHistory && jobChangeHistory.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Job Change History
              </h2>


              <table className="bg-white rounded-md text-left w-full">
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
                          const entry = {
                            staffId: curr.s_id,
                            changeDate: formatDate(curr.start_date), // Date of the current entry
                            previousRole: prev.jobs.job_title, // Role from the previous entry
                            newRole: curr.jobs.job_title, // Role from the current entry
                          };
                          console.log('Reduced Entry:', entry); // Log the reduced entry for debugging
                          acc.push(entry);
                        }
                      }
                      return acc;
                    }, [])
                    .map((entry, index) => {
                      console.log(`Rendering Row ${index + 1}:`, entry); // Log each row data for debugging
                      return (
                        <tr key={index}>
                          <td className="py-2 px-4 border-b">{entry.staffId}</td>
                          <td className="py-2 px-4 border-b">{formatDate(entry.changeDate)}</td>
                          <td className="py-2 px-4 border-b">{entry.previousRole}</td>
                          <td className="py-2 px-4 border-b">{entry.newRole}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>


            </div>
          )}
        </div>
      </div>
    </main>
  );
}
