interface IStyleOption{
    mask?: string;
    placeholder?:string;
}
interface IChoices{
    value: string | number;
    display_name: string;
}

export interface IOptionInput {
    label: string;
    max_length?: string;
    min_length?: string;
    read_only: boolean;
    required:boolean;
    type: string;
    style?:IStyleOption;
    choices?:IChoices[];
}