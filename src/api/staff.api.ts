// Staff API file
import { IStaff } from "@/types/user"; // Adjust import based on your type definitions
import endpoints from "@/utils/endpoints";
import fetcher from "@/utils/fetcher";
import { Exception } from "sass";

export const makeAppointment = async (formData: IStaff) => {

}

export const getStaff = async () => {
    try {
        const respone = await fetcher.get(endpoints.staff.readAll);
        console.log("Staff data:", respone);
        return respone;
    }
    catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Failed to load staff data.");
    }

}
