// types.ts
export interface IDataPress {
  [key: string]: string | boolean;
}

export interface DataPressState {
  dataPress: IDataPress;
  isUpdate: boolean;
}

export enum DataPressActionEnum {
  SET_DATAPRESS = 'SET_DATAPRESS',
  CLEAR_DATAPRESS = 'CLEAR_DATAPRESS',
  SET_UPDATE = 'SET_UPDATE',
}

export interface SetDataPressAction {
  type: DataPressActionEnum.SET_DATAPRESS;
  fieldName: string;
  fieldValue: string | boolean;
}

export interface ClearDataPressAction {
  type: DataPressActionEnum.CLEAR_DATAPRESS;
}

export interface SetUpdateAction {
  type: DataPressActionEnum.SET_UPDATE;
  payload: boolean;
}

export type DataPressAction = SetDataPressAction | ClearDataPressAction | SetUpdateAction;
