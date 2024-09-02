import { IPatient } from "@/types/user";
import endpoints from "@/utils/endpoints";
import fetcher from "@/utils/fetcher";


export const displayPatient = async (): Promise<IPatient[]> => {
    try {
        // Make an API call to fetch the list of patients
        const response = await fetcher<IPatient[]>({
            url: endpoints.patients, // This should be the API endpoint for fetching patients
            method: "GET", // Assuming you're using a GET request
        });

        // Return the list of patients
        return response;
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw new Error("Failed to fetch patients");
    }
};

