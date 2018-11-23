// Angular
import * as angular from 'angular';
import * as angularRoute from 'angular-route';
import * as angularAnimate from 'angular-animate';
import * as angularTranslate from 'angular-translate';
import * as angularUiBootstrap from 'angular-ui-bootstrap';
import 'angular-translate-loader-static-files';

// jQuery
import 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/draggable';

// Bootstrap
// import 'bootstrap/dist/css/bootstrap.css'; // Dont want to use that style! :)

// Core dependencies
import { MessageController, LanguageController} from './controllers';
import { RoutingConfig, TranslationConfig, TooltipProviderConfig } from './config';
import { TokenReplace } from './filters';
import { AjaxService, NotificationService, EventService, DateService, DebouncerService, MathHelper } from './services';
import { PageContext, ClientStatePoint } from './models';

// SPA context
var pageContext = new PageContext('views', [
    new ClientStatePoint('/techstack', undefined),
    new ClientStatePoint('/about', 'pages/about'),
    new ClientStatePoint('/contact', 'pages/contact'),
    new ClientStatePoint('/media', 'pages/media')
]);

export default angular.module('core', [angularRoute, angularAnimate, angularTranslate, angularUiBootstrap])
    .constant('pageContext', pageContext)
    .config(RoutingConfig.Factory())
    .config(TranslationConfig.Factory())
    .config(TooltipProviderConfig.Factory())
    .filter('tokenReplace', TokenReplace)
    .service('ajaxService', AjaxService)
    .service('eventService', EventService)
    .service('dateService', DateService)
    .service('debouncerService', DebouncerService)
    .service('notificationService', NotificationService)
    .service('mathHelper', MathHelper)
    .controller('messageController', MessageController)
    .controller('languageController', LanguageController)
    .name;
