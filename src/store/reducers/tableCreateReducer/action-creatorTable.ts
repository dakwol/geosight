// action-creatorUser.ts
import { IErr } from "../../../models/IErr";
import { SetErrorAction, SetTableAction, SetUpdateAction, TableActionEnum } from "./types";
export const TableActionCreators = {
  setTable: (table: any | undefined): SetTableAction => ({
    type: TableActionEnum.SET_TABLE,
    payload: table,
  }),
  setErr: (payload: IErr): SetErrorAction => ({ type: TableActionEnum.SET_ERROR, payload }),
  setUpdate: (payload: boolean): SetUpdateAction => ({ type: TableActionEnum.SET_UPDATE, payload }),
};

