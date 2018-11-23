 interface ILanguageScope extends ng.IScope {
    currentLanguage: string;
    ctrl: ILanguageController;
}

export interface ILanguageController {
    changeLanguage(language: string): void;
}

export default class LanguageController implements ILanguageController {
    static $inject = ['$scope', '$rootScope', '$translate'];

    constructor(private $scope: ILanguageScope,
        private $rootScope: ng.IRootScopeService,
        private $translate: ng.translate.ITranslateService) {
        this.$scope.ctrl = this;
        this.$rootScope.$on('$translateChangeSuccess', function(event, data) {
            $scope.currentLanguage = data.language;
        });
    }

    changeLanguage(language: string): void {
        this.$translate.use(language);
    }
}
