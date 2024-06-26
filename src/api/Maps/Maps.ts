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
}

export default MapsApiRequest;
