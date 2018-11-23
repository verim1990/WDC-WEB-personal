import { IEventService } from './../';
import { MessageNames } from './../../models';

export interface INotificationService {
    sendError(message: string): void;
    sendWarning(message: string): void;
    sendInfo(message: string): void;
    sendSuccess(message: string): void;
    clear(): void;
}

export default class NotificationService implements INotificationService {
    static $inject = ['eventService'];

    constructor(private eventService: IEventService) { }

    private sendMessage(messageName: string, content?: string): void {
        this.eventService.broadcastRootScopeEvent(messageName, content);
    }

    sendError(message: string): void {
        this.sendMessage(MessageNames.ErrorAlert, message);
    }

    sendWarning(message: string): void {
        this.sendMessage(MessageNames.WarningAlert, message);
    }

    sendInfo(message: string): void {
        this.sendMessage(MessageNames.InfoAlert, message);
    }

    sendSuccess(message: string): void {
        this.sendMessage(MessageNames.SuccessAlert, message);
    }

    clear(): void {
        this.sendMessage(MessageNames.ClearAlerts);
    }
}
