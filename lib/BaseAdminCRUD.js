"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAdminCRUD = void 0;
const IMuWidget_1 = require("./IMuWidget");
const App_1 = require("./App");
class BaseAdminCRUD extends IMuWidget_1.IMuWidget {
    afterIndex() {
        this.editor = this.muNamedWidget.editor;
        this.list = this.muNamedWidget.list;
        this.app = this.muParent["app"];
        this.editor.visible(false);
        setTimeout(() => this.listLoad(), 1);
    }
    bReload_click() {
        this.listLoad();
    }
    item_edit(sender, ev, id) {
        this.itemLoad(id, (data) => {
            this.editor.showErrors();
            this.editor.muBindData(data);
            this.editor.visible(true);
            this.editor.container.scrollIntoView();
            this.editor.setFormMode("edit");
            this.editor.afterLoad();
        });
    }
    bAdd_click(sender, ev, id) {
        this.editor.showErrors();
        this.editor.muBindData(this.getEmptyItem());
        this.editor.visible(true);
        this.editor.container.scrollIntoView();
        this.editor.setFormMode("new");
        this.editor.afterLoad();
    }
    item_delete(sender, ev, id) {
    }
    editor_save(sender, ev, id) {
        this.itemSave(id, this.editor.muFetchData(), (data) => {
            if (data.success) {
                this.editor.visible(false);
                this.listLoad();
                App_1.App.instance.flashMessage.add("Uloženo");
                this.afterSaved(data);
            }
            else if (data.errors) {
                this.editor.showErrors(data.errors);
                App_1.App.instance.flashMessage.add("Zadané údaje obsahují chybu.");
            }
        });
    }
    editor_cancel(sender, ev, id) {
        this.editor.visible(false);
    }
    afterSaved(data) { }
}
exports.BaseAdminCRUD = BaseAdminCRUD;
