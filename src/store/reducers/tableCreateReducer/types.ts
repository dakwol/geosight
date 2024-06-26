// types.ts
import { IErr } from "../../../models/IErr";

export interface TableState {
    Table: any | undefined;
    isLoading: boolean;
    isUpdate: boolean;
    error: IErr;
}

export enum TableActionEnum {
    SET_TABLE = 'SET_TABLE',
    SET_ERROR = 'SET_ERROR',
    SET_UPDATE = 'SET_UPDATE',
}

export interface SetTableAction {
    type: TableActionEnum.SET_TABLE;
    payload: any | undefined;
}

export interface SetErrorAction {
    type: TableActionEnum.SET_ERROR;
    payload: IErr;
}
export interface SetUpdateAction {
    type: TableActionEnum.SET_UPDATE;
    payload: boolean;
}

export type TableAction = 
    SetTableAction |
    SetErrorAction|
    SetUpdateAction
