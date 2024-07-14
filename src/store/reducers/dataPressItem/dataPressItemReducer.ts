// lifeSituationReducer.ts
import { DataPressAction, DataPressActionEnum, DataPressState } from "./types";

const initState: DataPressState = {
  dataPress: {},
  isUpdate: false,
};

export default function dataPressReducer(
  state = initState,
  action: DataPressAction
): DataPressState {
  switch (action.type) {
    case DataPressActionEnum.SET_DATAPRESS:
      return { 
        ...state, 
        dataPress: { 
          ...state.dataPress, 
          [action.fieldName]: action.fieldValue 
        } 
      };
    case DataPressActionEnum.SET_UPDATE:
      return { 
        ...state, 
        isUpdate: action.payload 
      };
    case DataPressActionEnum.CLEAR_DATAPRESS:
      return { 
        ...state, 
        dataPress: {} 
      };
    default:
      return state;
  }
}
