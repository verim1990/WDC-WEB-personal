import * as angular from 'angular';

// Modules
import Personal from './../personal/personal';

// Components
import { PreloadableViewDirective, VideoControl } from './directives';
import { AboutController, ContactController } from './controllers';

export default angular.module( 'main', [Personal])
  .directive('preloadableView', PreloadableViewDirective.Factory())
  .directive('videoControl', VideoControl.Factory())
  .controller('aboutController', AboutController)
  .controller('contactController', ContactController)
  .name;
