import { IEventService } from './../../services';
import { Alert, AlertType, MessageNames } from './../../models';

interface IMessageScope extends ng.IScope {
    alerts: Alert[];
    ctrl: IMessageController;
}

interface IMessageController {
    addAlert(message: string, type: AlertType): void;
    closeAlert(index: number): void;
    clearAlerts(): void;
}

export default class MessageController implements IMessageController {
    static $inject = ['$scope', '$timeout', 'eventService'];

    constructor(private $scope: IMessageScope,
        private $timeout: ng.ITimeoutService,
        private eventService: IEventService) {
        this.$scope.ctrl = this;
        this.$scope.alerts = [];

        this.registerNewAlertListener(MessageNames.ErrorAlert, AlertType.Error);
        this.registerNewAlertListener(MessageNames.WarningAlert, AlertType.Warning);
        this.registerNewAlertListener(MessageNames.InfoAlert, AlertType.Info);
        this.registerNewAlertListener(MessageNames.SuccessAlert, AlertType.Success);
        this.registerClearAlertListener(MessageNames.ClearAlerts);
    }

    private registerNewAlertListener(messageName: string, alertType: AlertType): void {
        this.eventService.listenToRootScopeEvent(messageName, (event: any, message: string) => {
            event.defaultPrevented = true;
            this.addAlert(message, alertType);
        });
    }

    private registerClearAlertListener(messageName: string): void {
        this.eventService.listenToRootScopeEvent(messageName, (event: any) => {
            event.defaultPrevented = true;
            this.clearAlerts();
        });
    }

    closeAlert(index: number): void {
        this.$scope.alerts.splice(index, 1);
    }

    clearAlerts(): void {
        this.$scope.alerts = [];
    }

    addAlert(message: string, type: AlertType): void {
        if (message === null || message === '') {
            return;
        }

        var alert = new Alert(message, type),
            scope = this.$scope;

        scope.alerts.push(alert);

        this.$timeout(function () {
            scope.alerts.splice(scope.alerts.indexOf(alert), 1);
        }, 5000);
    }
}
