export interface IDebouncerService {
    debounce(func, timeout: number): void;
}

export default class DebouncerService implements IDebouncerService {
    static $inject = [];

    constructor() { }

    public debounce = function(func, timeout = 200) {
        var timeoutID;
        return function () {
            var scope = this,
                args = arguments;

            clearTimeout(timeoutID);
            timeoutID = setTimeout(function () {
                func.apply(scope, Array.prototype.slice.call(args));
            }, timeout);
        };
    };
}
