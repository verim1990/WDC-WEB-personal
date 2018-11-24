import { INotificationService } from './../../../core/services';

interface IContactScope extends ng.IScope {
  ctrl: IContactController;
}

interface IContactController {
  send(text: string): void;
}

export default class ContactController implements IContactController {
  static $inject = ['$scope', 'notificationService'];

  constructor(
    private $scope: IContactScope,
    private notificationService: INotificationService) {
      this.$scope.ctrl = this;
    }

    send(text: string): void {
      this.notificationService.sendInfo(text);
    }
  }
