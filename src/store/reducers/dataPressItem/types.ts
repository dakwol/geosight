// types.ts
import { IDataPress } from "../../../models/IDataPress";

export interface DataPressState {
  dataPress: IDataPress | undefined;
}

export enum DataPressActionEnum {
  SET_DATAPRESS = 'SET_DATAPRESS',
  CLEAR_DATAPRESS = 'CLEAR_DATAPRESS', // New action type for clearing the dataPress
}

export interface SetDataPressAction {
  type: DataPressActionEnum.SET_DATAPRESS;
  fieldName: string;
  fieldValue: string | boolean;
}

export interface ClearDataPressAction {
  type: DataPressActionEnum.CLEAR_DATAPRESS;
}

export type DataPressAction = SetDataPressAction | ClearDataPressAction;
