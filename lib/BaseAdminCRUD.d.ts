import { IMuWidget } from "./IMuWidget";
import { App } from "./App";
import { UiFlashMessageContainer } from "./UiFlashMessage";
import { BaseForm } from "./BaseForm";
import { BaseAdminListItem } from "./BaseAdminListItem";
export declare abstract class BaseAdminCRUD extends IMuWidget {
    app: App;
    appConfig: any;
    loader: UiFlashMessageContainer;
    flashMessage: UiFlashMessageContainer;
    editor: BaseForm;
    list: BaseAdminListItem;
    afterIndex(): void;
    bReload_click(): void;
    item_edit(sender: any, ev: any, id: any): void;
    bAdd_click(sender: any, ev: any, id: any): void;
    item_delete(sender: any, ev: any, id: any): void;
    editor_save(sender: any, ev: any, id: any): void;
    editor_cancel(sender: any, ev: any, id: any): void;
    protected abstract listLoad(): any;
    protected abstract itemLoad(id: any, callback: (data: any) => void): any;
    protected abstract itemSave(id: any, data: any, callback: (data: any) => void): any;
    protected abstract itemDelete(id: any, callback: (data: any) => void): any;
    protected abstract getEmptyItem(): any;
    protected afterSaved(data: any): void;
}
