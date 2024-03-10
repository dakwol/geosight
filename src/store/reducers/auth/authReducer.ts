import { IToken } from "../../../models/IToken";
import { IUser } from "../../../models/IUser";
import { AuthAction, AuthActionEnum, AuthState } from "./types";

const initState: AuthState = {
    isAuth: false,
    user: {} as IUser,
    token: {} as IToken,
    isLoading: false,
    error: ""
};

export default function authReducer(
  state = initState,
  action: AuthAction
): AuthState {
  switch (action.type) {
    case AuthActionEnum.SET_AUTH:
      return { ...state, isAuth: action.payload, isLoading: false };
    case AuthActionEnum.SET_ERROR:
        return {...state, error: action.payload}
    case AuthActionEnum.SET_USER:
        return {...state, user: action.payload, isLoading: false}
    case AuthActionEnum.SET_IS_LOADING:
        return {...state, isLoading: action.payload}
    case AuthActionEnum.SET_TOKEN:
        return {...state, token: action.payload}
    default:
      return state;
  }
}
