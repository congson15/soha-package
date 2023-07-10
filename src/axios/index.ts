import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { CRAWL_URL } from '../constants';

export const axiosInstance = axios.create({
  baseURL: CRAWL_URL,
});

interface IRequestOptions {
  url: string;
  headers?: { [key: string]: string };
  method: 'GET' | 'POST';
  data?: { [key: string]: string } | string;
}

// axiosInstance.interceptors.response.use((response) => response.data);

export const axiosServices = {
  post: <T = unknown>(
    url: string,
    data: { [key: string]: string } | string,
    headers: { [key: string]: string } = {},
  ): Promise<AxiosRequestConfig<T>> => {
    const options: IRequestOptions = {
      method: 'POST',
      url,
      headers,
      data,
    };

    return axiosInstance.request(options);
  },
  get: <T = unknown>(url: string, headers: { [key: string]: string } = {}): Promise<AxiosResponse<T>> => {
    const options: IRequestOptions = {
      method: 'GET',
      url,
      headers,
    };

    return axiosInstance.request(options);
  },
};
