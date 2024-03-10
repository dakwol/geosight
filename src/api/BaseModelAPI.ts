import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AxiosInstance } from 'axios';
import apiConfig from './apiConfig';
import axiosClient from './axiosClient';

interface APIResponse<T> {
    success: boolean;
    data?: T | null;
    message: string;
}

interface BaseModelAPIParams {
    method?: string;
    id?: string;
    urlParams?: string;
    body?: any;
}

class BaseModelAPI {
    private baseUrl: string;
    private defaultParams: BaseModelAPIParams;
    private axiosClient: AxiosInstance;

    constructor(modelUrl: string, baseUrlDinamick?: string) {
        this.baseUrl = baseUrlDinamick ? baseUrlDinamick : apiConfig.baseUrl;
        this.baseUrl += modelUrl;
        this.defaultParams = {
            method: '',
            urlParams: '',
            id: '',
            body: null,
        };
        this.axiosClient = axios.create();
    }

    private returnResponse<T>(resp: AxiosResponse<T> | null): APIResponse<T> {
        return {
            success: !!resp,
            data: resp ? 'data' in resp ? resp.data : resp : null,
            message: resp ? 'Success' : 'No response received',
        };
    }

    protected async makeRequest<T>(requestFn: (url: string, config?: any) => Promise<AxiosResponse<T>>, params?: BaseModelAPIParams): Promise<APIResponse<T>> {
        const { method, id, urlParams, body } = { ...this.defaultParams, ...params };
   
        try {
            const resp = await requestFn(this.baseUrl + id + method + urlParams, body);
      
            return this.returnResponse(resp);
        } catch (error) {
            //@ts-ignore
            return { success: false, data: error, message: error.message || 'Unknown error' };
        }
    }

    async options<T>(params?: BaseModelAPIParams): Promise<APIResponse<T>> {
        return this.makeRequest<T>(axiosClient.options, params);
    }

    async list<T>(params?: BaseModelAPIParams): Promise<APIResponse<T>> {
        return this.makeRequest<T>(axiosClient.get, params);
    }

    // Для передачи id передать urlParams = #id
    async getById<T>(params?: BaseModelAPIParams): Promise<APIResponse<T>> {
        return this.makeRequest<T>(axiosClient.get, params);
    }

    async create<T>(params?: BaseModelAPIParams): Promise<APIResponse<T>> {
        return this.makeRequest<T>(axiosClient.post, params);
    }

    // Для передачи id передать urlParams = #id
    async update<T>(params?: BaseModelAPIParams): Promise<APIResponse<T>> {
        return this.makeRequest<T>(axiosClient.put, params);
    }
    // Для передачи id передать urlParams = #id
    async partialUpdate<T>(params?: BaseModelAPIParams): Promise<APIResponse<T>> {
        return this.makeRequest<T>(axiosClient.patch, params);
    }

    // Для передачи id передать urlParams = #id
    async delete<T>(params?: BaseModelAPIParams): Promise<APIResponse<T>> {
        return this.makeRequest<T>(axiosClient.delete, params);
    }
}

export default BaseModelAPI;
