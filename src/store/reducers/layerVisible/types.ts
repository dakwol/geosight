// types.ts
import { ILayerVisible } from "../../../models/ILayerVisible";

export interface LayerVisibleState {
    layerVisible: ILayerVisible[] | undefined;
}

export enum LayerVisibleActionEnum {
    SET_layerVisible = 'SET_layerVisible',
}

export interface SetLayerVisibleAction {
    type: LayerVisibleActionEnum.SET_layerVisible;
    payload: ILayerVisible[];
}


export type layerVisibleAction =
    LayerVisibleState