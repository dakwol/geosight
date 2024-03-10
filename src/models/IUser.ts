import { IOptionInput } from "./IOptionInput";

export interface IUser {
    id: string | undefined;
    phone_number: string;
    email: string;
    avatar: string;
    last_name?: string;
    first_name?: string;
    patronymic?: string;
    password: string;
}
export interface IUserOption {
    id: IOptionInput;
    phone_number: IOptionInput;
    email: IOptionInput;
    avatar: IOptionInput;
    last_name?: IOptionInput;
    first_name?: IOptionInput;
    patronymic?: IOptionInput;
    password: IOptionInput;
}