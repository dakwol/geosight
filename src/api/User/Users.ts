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
    async optionsUsersCompanies<T>() {
        return this.makeRequest<T>(axiosClient.options, {method: API_USER_MODEL.methods.getUsersCompanies.url});
    }
}

export default UserApiRequest;
