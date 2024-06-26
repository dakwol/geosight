// TableReducer.ts
import { IErr } from "../../../models/IErr";
import { TableAction, TableActionEnum, TableState } from "./types";

const initState: TableState = {
  isLoading: false,
  isUpdate: false,
  error: {} as IErr,
  Table: undefined,
};

export default function TableReducer(
  state = initState,
  action: TableAction
): TableState {
  switch (action.type) {
    case TableActionEnum.SET_TABLE:
      return { ...state, Table: action.payload };
    case TableActionEnum.SET_ERROR:
      return {...state, error: action.payload}
    case TableActionEnum.SET_UPDATE:
      return {...state, isUpdate: action.payload}
    default:
      return state;
  }
}
