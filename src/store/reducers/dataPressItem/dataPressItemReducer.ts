// lifeSituationReducer.ts
import { DataPressAction, DataPressActionEnum, DataPressState } from "./types";

const initState: DataPressState = {
  dataPress: {},
};

export default function dataPressReducer(
  state = initState,
  action: DataPressAction
): DataPressState {
  switch (action.type) {
    case DataPressActionEnum.SET_DATAPRESS:
      return { ...state, dataPress: { ...state.dataPress, [action.fieldName]: action.fieldValue } };
    case DataPressActionEnum.CLEAR_DATAPRESS:
      return { ...state, dataPress: {} }; // Clear the entire dataPress state
    default:
      return state;
  }
}
