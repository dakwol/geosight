import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_USER_MODEL } from "./const";

class UserApiRequest extends BaseModelAPI {
    constructor() {
        super(API_USER_MODEL.url);
    }
}

export default UserApiRequest;
