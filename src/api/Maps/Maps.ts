import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_MAPS_MODEL } from "./const";

class MapsApiRequest extends BaseModelAPI {
    constructor() {
        super(API_MAPS_MODEL.url);
    }

    async getShow<T>(id:string) {
        return this.makeRequest<T>(axiosClient.get, {id:id, method: API_MAPS_MODEL.methods.show.url});
    }
    async optionLayers<T>() {
        return this.makeRequest<T>(axiosClient.options, {urlParams: API_MAPS_MODEL.methods.layers.url});
    }
    async createLayers<T>(body:FormData) {
        return this.makeRequest<T>(axiosClient.post, {urlParams: API_MAPS_MODEL.methods.layers.url, body:body});
    }
    async updateLayers<T>(id:string, urlParams: string,body:FormData) {
        return this.makeRequest<T>(axiosClient.put, { urlParams: API_MAPS_MODEL.methods.layers.url + `${id}/${urlParams}/`, body:body});
    }
    async layersPropertis<T>(id:string, urlParams?: string) {
        return this.makeRequest<T>(axiosClient.get, { urlParams: API_MAPS_MODEL.methods.layers.url + `${id}/${API_MAPS_MODEL.methods.properties.url}${urlParams}`});
    }
    async layersPropertyValues<T>(id:string, type:string, urlParams?: string) {
        return this.makeRequest<T>(axiosClient.get, { urlParams: API_MAPS_MODEL.methods.layers.url + `${id}/${`${API_MAPS_MODEL.methods["property-values"].url}${type}`}${urlParams}`});
    }
    async mapsAllowed<T>() {
        return this.makeRequest<T>(axiosClient.get, { urlParams: API_MAPS_MODEL.methods.allowed.url});
    }
    async mapStyleOptions<T>(id:string,) {
        return this.makeRequest<T>(axiosClient.options, {id:id, urlParams: API_MAPS_MODEL.methods.mapstyle.url});
    }
    async mapStyle<T>(id:string,body:any) {
        return this.makeRequest<T>(axiosClient.put, {id:id, urlParams: API_MAPS_MODEL.methods.mapstyle.url, body:body});
    }
}

export default MapsApiRequest;
