import { PageContext } from './../../models';

export default class Routing {
    static $inject = ['$routeProvider', 'pageContext'];

    constructor($routeProvider: ng.route.IRouteProvider,
        pageContext: PageContext) {
        if (!pageContext  || !pageContext.routes.length) {
            return;
        }
        pageContext.routes.forEach((route) => {
            if (route.viewName === undefined) {
                $routeProvider.when(`${route.routeAddress}`, {
                    template: ''
                });
            } else {
                $routeProvider.when(`${route.routeAddress}`, {
                    templateUrl: `${pageContext.viewControllerAddress}/${route.viewName}`
                });
            }
        });
        $routeProvider.otherwise({
            redirectTo: pageContext.routes[0].routeAddress
        });
    }

    public static Factory() {
        var key = '$inject',
            config = ($routeProvider: ng.route.IRouteProvider, pageContext: PageContext) =>
                new Routing($routeProvider, pageContext);

        config[key] = ['$routeProvider', 'pageContext'];
        return config;
    }
}
