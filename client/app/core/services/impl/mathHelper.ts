export interface IMathHelper {
    getRandomInt(min: number, max: number);
}

export default class MathHelper implements IMathHelper {
    public getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public getRandomArrayElement<T>(array: Array<T>, removeTaken: boolean): T {
        let randomIndex = this.getRandomInt(0, array.length - 1);
        let element = array[randomIndex];

        if (removeTaken) {
            array.splice(randomIndex, 1);
        }

        return element;
    }
}
