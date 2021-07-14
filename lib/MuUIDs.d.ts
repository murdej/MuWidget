export declare class MuUIDs {
    static counters: Counters;
    static prefix: string;
    static next(k: keyof Counters): string;
}
declare type Counters = {
    id: number;
    name: number;
};
export {};
