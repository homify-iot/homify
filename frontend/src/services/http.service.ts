import axios from "axios";

// tslint:disable-next-line:variable-name
export const Http = axios.create({
    baseURL: `/api/v1/`,
});
