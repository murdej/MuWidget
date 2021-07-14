import { MuBindOpts } from "./MuBinder";
export declare class IMuWidget {
    ui: Record<string, AnyElement | any>;
    muWidgetFromTemplate(templateName: string, container: string | AnyElement, params?: Record<string, any> | ((MuWidget: any) => Record<string, any>), addMethod?: string): IMuWidget;
    muRemoveSelf(): void;
    container: HTMLElement;
    muGetChildWidgets<T>(container: string | AnyElement): T[];
    muBindList(list: any[], templateName: string, container: string | AnyElement, commonParams?: any, finalCalback?: (widget: any) => void): void;
    muVisible(state: boolean, control: string | string[]): void;
    muSubWidgets: IMuWidget[];
    muNamedWidget: Record<string, IMuWidget>;
    muRoot: IMuWidget;
    muParent: IMuWidget | null;
    muTemplates: Record<string, string>;
    muTemplateParents: Record<string, AnyElement>;
    muAddEvent(eventName: string, element: AnyElement, callback: any): void;
    muOnAfterIndex: ((self: any) => void)[];
    muBindOpts: Record<string, MuBindOpts[]>;
    muBindData(srcData: any): void;
    muFetchData(): any;
    muDispatchEvent(name: string, ...args: any[]): void;
    protected muRegisterEvent(...args: any[]): void;
    addEventListener(name: string, handler: (...args: any[]) => void): void;
    muEventNames(): string[];
    protected muAfterBindData(): void;
}
export declare type AnyElement = HTMLElement | SVGElement;
export declare function SetAttributes(element: AnyElement, attrs: Record<string, any>): void;
