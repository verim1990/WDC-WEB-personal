export default function TokenReplace() {
    return function(input: string, from: string, to: string) {
        input = input || '';
        from = from || '';
        to = to || '';

        return input.replace(new RegExp(from, 'g'), to);
    };
}
