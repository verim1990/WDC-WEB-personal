var moment = require('moment');

export interface IDateService {
    isUniversalIsoDateString(string: any): boolean;
    getDateFromUniversalIsoString(string: string): Date;
    getWcfStringForDate(date: Date): string;
    convertDatesInObjectToWcfDateString(object: any): void;
    convertDatesInObjectToIsoString(object: any): void;
    convertDateStringsInObjectToDate(object: any): void;
}

export default class DateService implements IDateService {
    isUniversalIsoDateString(string: any): boolean {
        if (!isNaN(string)) {
            return false;
        }

        var isoPattern = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/; // tslint:disable
        return string !== null && string.match ? (string.length > 4 && string.match(isoPattern)) : false;
    }

    getDateFromUniversalIsoString(string: string): Date {
        return this.isUniversalIsoDateString(string) ? moment(string).toDate() : null;
    }

    convertDateStringsInObjectToDate(object: any): void {
        var property, dateValue;

        if (!object) {
            return;
        }

        for (property in object) {
            if (!object.hasOwnProperty(property)) {
                continue;
            }

            if (typeof (object[property]) === 'object') {
                this.convertDateStringsInObjectToDate(object[property]);
                continue;
            }

            dateValue = this.getDateFromUniversalIsoString(object[property]);

            if (dateValue) {
                object[property] = dateValue;
            }
        }
    }

    getWcfStringForDate(date: Date): string {
        return date && date.getTime ? ('/Date(' + date.getTime() + ')/') : null;
    }

    convertDatesInObjectToWcfDateString(object: any): void {
        var property;

        if (!object) {
            return;
        }

        for (property in object) {
            if (!object.hasOwnProperty(property)) {
                continue;
            }

            if (typeof (object[property]) === 'object') {
                if (object[property] instanceof Date) {
                    object[property] = this.getWcfStringForDate(object[property]);
                } else {
                    this.convertDatesInObjectToWcfDateString(object[property]);
                }

                continue;
            }
        }
    }

    convertDatesInObjectToIsoString(object: any): void {
        var property;

        if (!object) {
            return;
        }

        for (property in object) {
            if (!object.hasOwnProperty(property)) {
                continue;
            }

            if (typeof (object[property]) === 'object') {
                if (object[property] instanceof Date) {
                    object[property] = object[property].toISOString();
                } else {
                    this.convertDatesInObjectToIsoString(object[property]);
                }

                continue;
            }
        }
    }
}
