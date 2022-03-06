/**
 * The api to connect to the server
 * Created at 2021/11/14
 * Created by Alex.M
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
