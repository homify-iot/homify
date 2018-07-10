import axios from "axios";

export const Http = axios.create({
    baseURL: `/api/v1/`,
})