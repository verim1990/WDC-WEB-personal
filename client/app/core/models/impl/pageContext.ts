export class ClientStatePoint {
    routeAddress: string;
    viewName: string;

    constructor(routeAddress: string, viewName: string) {
        this.routeAddress = routeAddress;
        this.viewName = viewName;
    }

    public hasView(): boolean {
        return this.viewName != null && this.viewName.length > 0;
    }
}

export default class PageContext {
    viewControllerAddress: string;
    routes: ClientStatePoint[];

    constructor(viewControllerAddress: string, routes: ClientStatePoint[]) {
        this.viewControllerAddress = viewControllerAddress;
        this.routes = routes;
    }
}
