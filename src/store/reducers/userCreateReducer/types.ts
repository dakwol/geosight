// types.ts
import { IErr } from "../../../models/IErr";
import { IUser } from "../../../models/IUser";

export interface UserState {
    User: IUser | undefined;
    isLoading: boolean;
    isUpdate: boolean;
    error: IErr;
}

export enum UserActionEnum {
    SET_USER = 'SET_USER',
    SET_ERROR = 'SET_ERROR',
    SET_UPDATE = 'SET_UPDATE',
}

export interface SetUserAction {
    type: UserActionEnum.SET_USER;
    payload: IUser | undefined;
}

export interface SetErrorAction {
    type: UserActionEnum.SET_ERROR;
    payload: IErr;
}
export interface SetUpdateAction {
    type: UserActionEnum.SET_UPDATE;
    payload: boolean;
}

export type UserAction = 
    SetUserAction |
    SetErrorAction|
    SetUpdateAction
