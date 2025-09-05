import axios from 'axios';

export const axiosInstance = axios.create({
    withCredentials: true, // This enables sending cookies
    // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: method,
        url: url,
        data: bodyData || null,
        headers: headers || null,
        params: params || null
    });
};
