import { DataPressActionEnum, SetDataPressAction, ClearDataPressAction } from "./types";
import { IDataPress } from "../../../models/IDataPress";

export const DataPressActionCreators = {
  setDataPress: (fieldName: string, fieldValue: string | boolean): SetDataPressAction => ({
    type: DataPressActionEnum.SET_DATAPRESS,
    fieldName,
    fieldValue,
  }),
  clearDataPress: (): ClearDataPressAction => ({
    type: DataPressActionEnum.CLEAR_DATAPRESS,
  }),
};
