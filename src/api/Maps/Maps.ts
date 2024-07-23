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
    async layersPoi<T>() {
        return this.makeRequest<T>(axiosClient.get, {method: API_MAPS_MODEL.methods.layersPoi.url});
    }
    async optionLayers<T>() {
        return this.makeRequest<T>(axiosClient.options, {urlParams: API_MAPS_MODEL.methods.layers.url});
    }
    async layersScoringOption<T>() {
        return this.makeRequest<T>(axiosClient.options, {urlParams: API_MAPS_MODEL.methods.layersScoring.url});
    }
    async getLayersScoring<T>(urlParams?:string) {
        return this.makeRequest<T>(axiosClient.get, {urlParams: `${API_MAPS_MODEL.methods.layersScoring.url}${urlParams ? urlParams : ''}`});
    }
    async createScoring<T>(body:any) {
        return this.makeRequest<T>(axiosClient.post, {urlParams: API_MAPS_MODEL.methods.createScoring.url, body:body});
    }
    async updateLayersScoring<T>(id:string,body:any) {
        return this.makeRequest<T>(axiosClient.put, {urlParams: `${API_MAPS_MODEL.methods.layersScoring.url}${id}/`, body:body});
    }
    async killLayersScoring<T>(id:string) {
        return this.makeRequest<T>(axiosClient.post, {urlParams: `${API_MAPS_MODEL.methods.layersScoringStop.url}?id=${id}`});
    }
    async getLayers<T>(urlParams?: string) {
        return this.makeRequest<T>(axiosClient.get, {urlParams: `${API_MAPS_MODEL.methods.layers.url}${urlParams? urlParams : ''}`});
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
        return this.makeRequest<T>(axiosClient.get, { urlParams: API_MAPS_MODEL.methods.layers.url + `${id}/${`${API_MAPS_MODEL.methods["property-values"].url}${type}`}${urlParams ? urlParams : ''}`});
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
    async signAllowedUser<T>(id:string, urlParams:string) {
        return this.makeRequest<T>(axiosClient.post, {id:id,urlParams: `${API_MAPS_MODEL.methods.signAllowedUser.url}${urlParams}`});
    }
    async getAllowedUser<T>(id:string) {
        return this.makeRequest<T>(axiosClient.get, {id:id,urlParams: `${API_MAPS_MODEL.methods.getAllowedUser.url}`});
    }
    async removeAllowedUser<T>(id:string, urlParams:string) {
        return this.makeRequest<T>(axiosClient.post, {id:id,urlParams: `${API_MAPS_MODEL.methods.removeAllowedUser.url}?user=${urlParams}`});
    }
    async mapsFromCreate<T>() {
        return this.makeRequest<T>(axiosClient.get, {urlParams: `${API_MAPS_MODEL.methods.layers.url}${API_MAPS_MODEL.methods.mapsFromCreate.url}`});
    }
    async getByIdLayer<T>(id:string) {
        return this.makeRequest<T>(axiosClient.get, {urlParams: `${API_MAPS_MODEL.methods.layers.url}${id}/data/`});
    }
    async updateByIdLayer<T>(id:string, body:any) {
        return this.makeRequest<T>(axiosClient.put, {urlParams: `${API_MAPS_MODEL.methods.layers.url}${id}`, body:body});
    }
    async deleteByIdLayer<T>(id:string) {
        return this.makeRequest<T>(axiosClient.delete, {urlParams: `${API_MAPS_MODEL.methods.layers.url}${id}`});
    }
}

export default MapsApiRequest;
