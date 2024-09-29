import axios from 'axios';

const http = axios.create({
  baseURL: 'http://43.131.240.184:8767/api/v1',
  // baseURL: 'http://192.168.31.119:8767/api/v1',
  timeout: 5000,
});

http.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  },
);

export {http};
