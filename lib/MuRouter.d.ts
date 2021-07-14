export declare class MuRouter {
    protected routes: Record<string, Route>;
    persistentKeys: string[];
    persistentValues: MuParameters;
    pathPrefix: string;
    addRoute(name: string, re: string, callback: RouteCallback): MuRouter;
    private static compileRe;
    protected lastParameters: MuParameters;
    route(location?: Location | {
        pathname: string;
        search: string;
    } | string): void;
    makeUrl(name: string, currParams: any): string;
    push(name: string, params?: MuParameters): void;
    replace(name: string, params?: MuParameters): void;
    update(name: string, params?: MuParameters): void;
    navigate(name: string, params?: MuParameters): void;
    parseQueryString(queryString: string): MuParameters;
    constructor();
    updatePersistent(res: MuParameters, patch?: boolean): void;
    getParameters(): MuParameters;
}
declare type RouteCallback = (context: MuRouterContext) => void;
declare type Route = {
    paramNames: string[];
    reText: string;
    re: RegExp;
    name: string;
    callback: RouteCallback;
    chunks: (string | {
        name: string;
    })[];
};
export declare type MuParameters = Record<string, string | true | null>;
export declare type MuRouterContext = {
    parameters: MuParameters;
    routeName: string;
};
export {};
