import { INotificationService, IDateService } from './../';
import { Response, RequestResultType } from './../../models';

export interface IAjaxService {
    get(address: string): ng.IPromise<{}>;
    getWithData(address: string, data: any): ng.IPromise<{}>;
    post(address: string, data: any): ng.IPromise<{}>;
}

export default class AjaxService implements IAjaxService {
    static $inject = ['$http', '$q', 'notificationService', 'dateService'];

    constructor(
        private $http: ng.IHttpService,
        private $q: ng.IQService,
        private notificationService: INotificationService,
        private dateService: IDateService) { }

    private showErrors(messages: string[]): void {
        if (!messages || !messages.forEach) {
            return this.notificationService
                .sendError('Some errors occured during request processing. Error messages have not been defined');
        }

        return messages.forEach(message => this.notificationService.sendError(message));
    }

    private proceedResponse(data: any): void {
        this.dateService.convertDateStringsInObjectToDate(data);
    }

    private executeAjaxSuccessResponse(responseData: Response): any {
        switch (responseData.requestResult) {
            case RequestResultType.Error:
                this.showErrors(responseData.messages);
                return this.$q.reject(responseData.messages);
            case RequestResultType.Redirect:
                location.href = responseData.data;
                return this.$q.reject(`Redirect to ${responseData.data}`);
            case RequestResultType.Ok:
                return responseData.data;
        }
    }

    private successCallback(response: any): any {
        if (!response || !response.data) {
            return this.$q.reject('Empty response');
        }

        if (!response.data.requestResult) {
            return this.$q.reject('Invalid response object. Use AjaxResponse class.');
        }

        this.proceedResponse(response.data);
        return this.executeAjaxSuccessResponse(response.data);
    }

    private errorCallback(error: any): any {
        if (!error) {
            error = 'Empty response in error callback';
        }

        this.showErrors([error.statusText]);
        return this.$q.reject(error);
    }

    get(address: string): ng.IPromise<{}> {
        return this.$http.get(address).then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    getWithData(address: string, data: any): ng.IPromise<{}> {
        const config = {
            params: data,
            responseType: 'json'
        };
        return this.$http.get(address, config).then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    post(address: string, data: {}): ng.IPromise<{}> {
        return this.$http.post(address, data).then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }
}
