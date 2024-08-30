import { IRegisterProps } from "@/types/user"; // Adjust import based on your type definitions
import endpoints from "@/utils/endpoints";
import fetcher from "@/utils/fetcher";

export const registerAccount = async (formData: IRegisterProps) => {
    try {
        const response = await fetcher.post(endpoints.auth.register, formData);
        console.log("Response after registration: ", response);
        return response;
    } catch (exception) {
        console.log("Error: ", exception);
        throw new Error(`Registration Failed!`);
    }
}
