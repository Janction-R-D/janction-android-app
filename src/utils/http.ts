import axios from "axios";

const http = axios.create({
  baseURL: 'http://10.0.2.2:8767/api/v1',
  timeout: 5000,
});

http.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { http };
