export enum AlertType {
    Error = 1,
    Warning,
    Info,
    Success
}

export default class Alert {
    alertType: AlertType;
    message: string;
    type: string;

    constructor(message: string, type: AlertType) {
        this.message = message;
        this.alertType = type;
        this.type = this.getAlertTypeClass(type);
    }

    private getAlertTypeClass(type: AlertType): string {
        switch (type) {
        case AlertType.Error:
            return 'danger';
        case AlertType.Warning:
            return 'warning';
        case AlertType.Success:
            return 'success';
        default:
            return 'info';
        }
    }
}
