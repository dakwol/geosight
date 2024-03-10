import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_TOKEN_MODEL } from "./const";

class TokenApiRequest extends BaseModelAPI {
    constructor() {
        super(API_TOKEN_MODEL.url + API_TOKEN_MODEL.methods.login.url);
    }
}

export default TokenApiRequest;
