import { IMuWidget } from "./IMuWidget";
export declare class UiTabs extends IMuWidget {
    labelAtributeName: string;
    protected tabLabels: Record<string, HTMLElement>;
    private liClassName;
    private aClassName;
    private aActiveClassName;
    onSelectTab: (muId: string) => void;
    selectedTabId: string;
    afterIndex(): void;
    private makeTabs;
    selectTab(selectedMuId: string): void;
}
