import axios from 'axios';

const https = axios.create({
    baseURL: 'http://localhost:2509/api',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

// Add a request interceptor

https.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        const token = localStorage.getItem('persist:auth') ? JSON.parse(localStorage.getItem('persist:auth')).token.replace(/"/g, '') : null;
        // console.log(token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor

https.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

export default https;