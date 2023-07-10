import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { CRAWL_URL } from '../constants';

export const axiosInstance = axios.create({
  baseURL: CRAWL_URL,
});

interface IRequestOptions {
  headers?: { [key: string]: string };
  method: 'GET' | 'POST';
  path: string;
  body?: { [key: string]: string };
}

// axiosInstance.interceptors.response.use((response) => response.data);

export const axiosServices = {
  post: <T = unknown>(
    path: string,
    body: { [key: string]: string },
    headers: { [key: string]: string } = {},
  ): Promise<AxiosRequestConfig<T>> => {
    const options: IRequestOptions = {
      method: 'POST',
      path,
      headers,
      body,
    };

    return axiosInstance.request(options);
  },
  get: <T = unknown>(path: string, headers: { [key: string]: string } = {}): Promise<AxiosResponse<T>> => {
    const options: IRequestOptions = {
      method: 'GET',
      path,
      headers,
    };

    return axiosInstance.request(options);
  },
};
