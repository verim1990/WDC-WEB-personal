export default class TooltipProviderConfig {
    static $inject = ['$uibTooltipProvider'];

    constructor($uibTooltipProvider: any) {
        $uibTooltipProvider.setTriggers({
            'show': 'hide'
        });
    }

    public static Factory() {
        var key = '$inject',
            config = ($uibTooltipProvider: any) =>
                new TooltipProviderConfig($uibTooltipProvider);

        config[key] = ['$uibTooltipProvider'];
        return config;
    }
}
