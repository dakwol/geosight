import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_USER_MODEL } from "./const";

class UserApiRequest extends BaseModelAPI {
    constructor() {
        super(API_USER_MODEL.url);
    }

    async getUsersCompanies<T>() {
        return this.makeRequest<T>(axiosClient.get, {method: API_USER_MODEL.methods.getUsersCompanies.url});
    }
    async getCompanyUsers<T>() {
        return this.makeRequest<T>(axiosClient.get, {method: API_USER_MODEL.methods.getCompanyUsers.url});
    }
    async optionsUsersCompanies<T>() {
        return this.makeRequest<T>(axiosClient.options, {method: API_USER_MODEL.methods.getUsersCompanies.url});
    }
    async sendCode<T>(body:any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_USER_MODEL.methods.sendCode.url, body:body});
    }
    async checkActivationCode<T>(body:any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_USER_MODEL.methods.checkActivationCode.url, body:body});
    }
    async resetPassword<T>(body:any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_USER_MODEL.methods.resetPassword.url, body:body});
    }
    async getUsersCards<T>(urlParametr:string) {
        return this.makeRequest<T>(axiosClient.get, {urlParams:`?search=${urlParametr}`,method: API_USER_MODEL.methods.cards.url});
    }
}

export default UserApiRequest;
