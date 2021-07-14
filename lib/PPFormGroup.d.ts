declare class PPFormGroupConfig {
    containerCssClass: ConfigItem<string>;
    labelCssClass: ConfigItem<string>;
    inputContainerCssClass: ConfigItem<string>;
    inputCssClass: ConfigItem<string>;
    labelSize: ConfigItem<number>;
    errorCssClass: ConfigItem<string>;
}
export declare class PPFormGroup extends PPFormGroupConfig {
    static defaultConfig: PPFormGroupConfig;
    label: string;
    preproc(element: HTMLElement): void;
    getConfigValue(k: keyof PPFormGroupConfig | string): any;
}
declare type ConfigItem<T> = T | ((UiFormGroup: any) => T);
export declare function TwitterBootstrap4(config: PPFormGroupConfig, labelSize?: number): void;
export declare function TwitterBootstrap3(config: PPFormGroupConfig, labelSize?: number): void;
export {};
