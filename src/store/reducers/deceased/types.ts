// types.ts
import { IErr } from "../../../models/IErr";
import { IDeceased } from "../../../models/IDeceased";

export interface DeceasedState {
    deceased: IDeceased[] | undefined;
    isLoading: boolean;
    isUpdate: boolean;
    error: IErr;
}

export enum DeceasedActionEnum {
    SET_DECEASED = 'SET_DECEASED',
    SET_ERROR = 'SET_ERROR',
    SET_UPDATE = 'SET_UPDATE',
}

export interface SetDeceasedAction {
    type: DeceasedActionEnum.SET_DECEASED;
    payload: IDeceased[];
}

export interface SetErrorAction {
    type: DeceasedActionEnum.SET_ERROR;
    payload: IErr;
}
export interface SetUpdateAction {
    type: DeceasedActionEnum.SET_UPDATE;
    payload: boolean;
}

export type DeceasedAction = 
    SetDeceasedAction |
    SetErrorAction|
    SetUpdateAction