import { ILoginProps } from "@/types/user";
import endpoints from "@/utils/endpoints";
import fetcher from "@/utils/fetcher";

export const login = async (formData: ILoginProps) => {
    try {   
        const response = await fetcher.post(endpoints.auth.login, formData);
        console.log("Response after login: ", response)
        return response;
    } catch(exception) {
        console.log("Error: ", exception)
        throw Error(`Login Failed!`)
    }
}