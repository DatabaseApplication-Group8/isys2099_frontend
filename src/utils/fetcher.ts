import axios from "axios";

const fetcher = axios.create({
    baseURL: "",
    headers: {},
    timeout: 3000
});

fetcher.interceptors.request.use((config) => {
    // console.log("config: ", config)

    //! Set Local Storage = accessToken
    return config;
});

fetcher.interceptors.response.use((response) => {
    // console.log("response: ", response)
    return response
})

export default fetcher