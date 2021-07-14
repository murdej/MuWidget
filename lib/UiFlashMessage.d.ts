import { IMuWidget } from "./IMuWidget";
export declare class UiFlashMessageContainer extends IMuWidget {
    afterIndex(): void;
    updateVisibility(): void;
    add(text: string): UiFlashMessage;
}
export declare class UiFlashMessage extends IMuWidget {
    text: string;
    afterIndex(): void;
    remove(): void;
    bClose_click(): void;
}
