// action-creatorlife.ts
import { DeceasedActionEnum, SetErrorAction, SetDeceasedAction, SetUpdateAction } from "./types";
import { IDeceased } from "../../../models/IDeceased";
import { IErr } from "../../../models/IErr";

export const DeceasedActionCreators = {
  setDeceased: (deceased: IDeceased[]): SetDeceasedAction => ({
    type: DeceasedActionEnum.SET_DECEASED,
    payload: deceased,
  }),
  setErr: (payload: IErr): SetErrorAction => ({ type: DeceasedActionEnum.SET_ERROR, payload }),
  setUpdate: (payload: boolean): SetUpdateAction => ({ type: DeceasedActionEnum.SET_UPDATE, payload }),
};
