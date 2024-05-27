import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_MAPS_MODEL } from "./const";

class MapsApiRequest extends BaseModelAPI {
    constructor() {
        super(API_MAPS_MODEL.url);
    }
}

export default MapsApiRequest;
