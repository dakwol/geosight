// actions.ts
import { DataPressActionEnum, SetDataPressAction, ClearDataPressAction, SetUpdateAction } from "./types";

export const DataPressActionCreators = {
  setDataPress: (fieldName: string, fieldValue: string | boolean): SetDataPressAction => ({
    type: DataPressActionEnum.SET_DATAPRESS,
    fieldName,
    fieldValue,
  }),
  clearDataPress: (): ClearDataPressAction => ({
    type: DataPressActionEnum.CLEAR_DATAPRESS,
  }),
  setUpdate: (payload: boolean): SetUpdateAction => ({
    type: DataPressActionEnum.SET_UPDATE,
    payload,
  }),
};
