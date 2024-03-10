import axios from 'axios';
import queryString from 'query-string';

import apiConfig from './apiConfig';
import { useDispatch } from 'react-redux';
import { AuthActionCreators } from '../store/reducers/auth/action-creator';

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify({ ...params, api_key: apiConfig.apiKey }),
});

axiosClient.interceptors.request.use(async (config) => {
  const access = localStorage.getItem('access');
  
  if (access) {
    config.headers['Authorization'] = `Bearer ${access}`;
  }
  
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    console.log('Error occurred:', error);

    if (error.response) {
      if (error.response.status === 401) {
        console.log('Handling error 401');
        
        const dispatch = useDispatch();
        const username = localStorage.getItem('user');
        //@ts-ignore
        dispatch(AuthActionCreators.login(username && username.email, username.password));
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
);

export default axiosClient;
