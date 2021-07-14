import { IMuWidget } from "./IMuWidget";
export declare class BaseForm extends IMuWidget {
    id: number;
    private formMode;
    afterIndex(): void;
    showErrors(errors?: Record<string, string[]>): void;
    bSave_click(): void;
    bCancel_click(): void;
    visible(visible: boolean): void;
    setFormMode(formMode: FormMode): void;
    afterLoad(): void;
}
export declare type FormMode = "new" | "edit";
