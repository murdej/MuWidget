import { IMuWidget } from "./IMuWidget";
export declare class UiSelector extends IMuWidget {
    items: Record<SelectorValue, SelectorItem>;
    cssClassActive: string;
    containerTag: string;
    bindItemValues: ((item: SelectorItem, container: HTMLElement) => void) | null;
    containerCssClass: string;
    textField: string;
    valueField: string;
    onchange: ((ev: SelectorChangeEvent) => void) | null;
    private value;
    getActive(): SelectorValue | null;
    setActive(value: SelectorValue): void;
    bindValues(items: SelectorItem[]): void;
    addItem(item: SelectorItem, before?: SelectorValue | "first" | null): void;
    afterIndex(): void;
}
export declare type SelectorValue = number | string;
export declare type SelectorItem = {
    value: SelectorValue;
    element: HTMLElement;
} | any;
export declare type SelectorChangeEvent = {
    originalEvent: Event;
    sender: UiSelector;
    item: SelectorItem;
    value: SelectorValue;
};
