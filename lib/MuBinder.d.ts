import { AnyElement, IMuWidget } from "./IMuWidget";
export declare class MuBinder {
    static parse(src: string, element: AnyElement): MuBindOpts[];
    static setDefaults(mbo: MuBindOpts): void;
    static beforeIndexElement(ev: {
        opts: any;
        element: AnyElement;
        widget: IMuWidget;
    }): void;
    static register(muWidget: any): void;
    static bindData(bindOpts: Record<string, MuBindOpts[]>, srcData: any, widget: IMuWidget): void;
    static fetchData(bindOpts: Record<string, MuBindOpts[]>, widget: IMuWidget): any;
    private static UseFilters;
    private static setValue;
    static setDeep(value: any, object: any, path: string): void;
    static getDeep(object: any, path: string): any;
    private static GetValue;
    static filters: Record<string, MuBindFilterCallback>;
}
export declare type MuBindFilterCallback = (val: any, ev?: MuBindFilterEv, ...args: any[]) => any;
export declare type MuBindOpts = {
    forBind: boolean;
    forFetch: boolean;
    source: string;
    target: string | null;
    bindFilters: MuBindFilter[];
    fetchFilters: MuBindFilter[];
    element: AnyElement;
};
export declare type MuBindFilter = {
    methodName: string;
    args: any[];
};
export declare type MuBindFilterEv = {};
