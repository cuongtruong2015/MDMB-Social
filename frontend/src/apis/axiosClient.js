import { logout, refreshToken } from 'app/actions/login';
import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

export const interceptor = (store) => {
  axiosClient.interceptors.request.use(
    async (config) => {
      const auth = store?.getState()?.login?.auth;
      if (!config.headers['Authorization'] && auth?.accessToken) {
        config.headers['Authorization'] = auth?.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axiosClient.interceptors.response.use(
    (response) => {
      if (response && response.data) {
        return response.data;
      }
      return response;
    },
    (error) => {
      if (!error?.status && !error?.response?.status) {
        return Promise.reject(error);
      }
      if (error?.response?.status === 401) {
        if (error.response.data.error === 'Token expired') {
          const rt = store?.getState()?.login?.auth?.refreshToken;
          if (rt) {
            store.dispatch(refreshToken(rt));
          }
        } else if (error.response.data.result === 'login failure') {
          error.response.data.message = 'Wrong email or password!';
          return Promise.reject(error.response);
        } else if (error?.response?.data.error === 'Refresh token expired') {
          store.dispatch(
            logout({
              message: 'Your session has expired. Please login again.',
              type: 'error',
            })
          );
          return Promise.reject(error.response);
        }
      }
      return Promise.reject({ error });
    }
  );
};

export default axiosClient;
