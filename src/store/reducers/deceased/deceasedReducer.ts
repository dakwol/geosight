// lifeSituationReducer.ts
import { IErr } from "../../../models/IErr";
import { DeceasedAction, DeceasedActionEnum, DeceasedState } from "./types";

const initState: DeceasedState = {
  isLoading: false,
  isUpdate:false,
  error: {} as IErr,
  deceased: undefined,
};

export default function deceasedReducer(
  state = initState,
  action: DeceasedAction
): DeceasedState {
  switch (action.type) {
    case DeceasedActionEnum.SET_DECEASED:
      return { ...state, deceased: action.payload };
    case DeceasedActionEnum.SET_ERROR:
      return {...state, error: action.payload}
    case DeceasedActionEnum.SET_UPDATE:
      return {...state, isUpdate: action.payload}
    default:
      return state;
  }
}