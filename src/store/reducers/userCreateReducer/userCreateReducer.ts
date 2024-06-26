// UserReducer.ts
import { IErr } from "../../../models/IErr";
import { UserAction, UserActionEnum, UserState } from "./types";

const initState: UserState = {
  isLoading: false,
  isUpdate: false,
  error: {} as IErr,
  User: undefined,
};

export default function UserReducer(
  state = initState,
  action: UserAction
): UserState {
  switch (action.type) {
    case UserActionEnum.SET_USER:
      return { ...state, User: action.payload };
    case UserActionEnum.SET_ERROR:
      return {...state, error: action.payload}
    case UserActionEnum.SET_UPDATE:
      return {...state, isUpdate: action.payload}
    default:
      return state;
  }
}
