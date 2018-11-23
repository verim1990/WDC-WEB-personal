interface IResponse {
    requestResult: RequestResultType;
    data: any;
    messages: string[];
}

export enum RequestResultType {
    Ok = 1,
    Error,
    Redirect
}

export default class Response implements IResponse {
    requestResult: RequestResultType;
    data: any;
    messages: string[];
}
