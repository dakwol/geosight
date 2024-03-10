import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_PASSWORD_MODEL, API_USER_MODEL } from "./const";

class ResetPasswordApiRequest extends BaseModelAPI {
    constructor() {
        super(API_PASSWORD_MODEL.url, apiConfig.baseUrl + 'users/');
    }
}

export default ResetPasswordApiRequest;
