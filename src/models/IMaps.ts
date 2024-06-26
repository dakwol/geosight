import { IOptionInput } from "./IOptionInput";

export interface IMapsHeaderOptions{
    key:string;
    value:IOptionInput
}
export interface IMapsCreateOptions{
    company: IOptionInput;
    description: IOptionInput;
    name: IOptionInput;
}
export interface IMapsListOptions{
    id: IOptionInput;
    description: IOptionInput;
    name: IOptionInput;
    updated_at: IOptionInput;
}
export interface IMapsShareOptions{
    id: IOptionInput;
    users: IOptionInput;
}
export interface iStyleMap {
    id: string | number;
    name: string;
    url: string;
  }