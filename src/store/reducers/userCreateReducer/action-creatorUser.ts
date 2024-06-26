// action-creatorUser.ts
import { IErr } from "../../../models/IErr";
import { IUser } from "../../../models/IUser";
import { SetErrorAction, SetUpdateAction, SetUserAction, UserActionEnum } from "./types";
export const UserActionCreators = {
  setUser: (user: IUser | undefined): SetUserAction => ({
    type: UserActionEnum.SET_USER,
    payload: user,
  }),
  setErr: (payload: IErr): SetErrorAction => ({ type: UserActionEnum.SET_ERROR, payload }),
  setUpdate: (payload: boolean): SetUpdateAction => ({ type: UserActionEnum.SET_UPDATE, payload }),
};

