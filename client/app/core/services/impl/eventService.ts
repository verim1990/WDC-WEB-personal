export interface IEventService {
    broadcastRootScopeEvent(name: string, data: {}): void;
    listenToRootScopeEvent(name: string, callback: any): void;
    emitEvent($scope: ng.IScope, name: string, data: {}): void;
    broadcastEvent($scope: ng.IScope, name: string, data: {}): void;
    listenToEvent($scope: ng.IScope, name: string, callback: any): void;
}

export default class EventService implements IEventService {
    static $inject = ['$rootScope'];

    constructor(private $rootScopeService: ng.IRootScopeService) { }

    broadcastRootScopeEvent(name: string, data: {}): void {
        this.$rootScopeService.$broadcast(name, data);
    }

    listenToRootScopeEvent(name: string, callback: any): void {
        this.$rootScopeService.$on(name, callback);
    }

    emitEvent($scope: ng.IScope, name: string, data: {}): void {
        $scope.$emit(name, data);
    }

    broadcastEvent($scope: ng.IScope, name: string, data: {}): void {
        $scope.$broadcast(name, data);
    }

    listenToEvent($scope: ng.IScope, name: string, callback: any) {
        $scope.$on(name, callback);
    }
}
