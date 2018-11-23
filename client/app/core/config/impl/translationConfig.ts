export default class TranslationConfig {
    static $inject = ['$translateProvider'];

    constructor($translateProvider: ng.translate.ITranslateProvider) {
        $translateProvider
            .useStaticFilesLoader
            ({
                prefix: './assets/locales/',
                suffix: '.json'
            })
            .preferredLanguage('pl');
    }

    public static Factory() {
        var key = '$inject',
            config = ($translateProvider: ng.translate.ITranslateProvider) =>
                new TranslationConfig($translateProvider);

        config[key] = ['$translateProvider'];
        return config;
    }
}
