import { logout } from '@/store/slices/adminSlice';
import { Store } from '@reduxjs/toolkit';
import axios from 'axios';

let store: Store;

export const injectStore = (_store: Store) => {
  store = _store;
};

export const defaultHttp = axios.create();
const http = axios.create({
  baseURL: 'http://localhost:9090',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  (config) => {
    // const state: RootState = store.getState();
    // const apiToken = state.admin?.token;

    // // config.headers['x-api-key'] = 'reqres-free-v1';

    // if (apiToken) {
    //   config.headers.Authorization = `Bearer ${apiToken}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default http;
