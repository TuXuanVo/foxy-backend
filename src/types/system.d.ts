declare interface ICreateSetting {
    name: string;
    value: number | string | boolean;
}

declare interface IUpdateSetting {
    name?: string;
    value?: number | string | boolean;
}
