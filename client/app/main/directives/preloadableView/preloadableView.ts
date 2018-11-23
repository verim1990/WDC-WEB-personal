import * as angular from 'angular';

import { PageContext, ClientStatePoint } from './../../../core/models';
import { DebouncerService } from '../../../core/services';
import { Skill, SkillMatrixModel, ISkillMatrixApi } from '../../../personal/techstack';

enum PreloadableViewStatus {
  Opening,
  Opened,
  Closing,
  Closed
}

interface IPreloadableViewScope extends ng.IScope {
  location: string;

  // Internal
  status: PreloadableViewStatus;
  skillMatrixModel: SkillMatrixModel;
  skillMatrixApi: ISkillMatrixApi;
}

export interface IPreloadableViewController {
}

export class PreloadableViewController implements IPreloadableViewController {
  static $inject = ['$scope', 'techstackConfig'];

  constructor(private $scope: IPreloadableViewScope, private techstackConfig: Array<Skill>) {
    $scope.skillMatrixModel = new SkillMatrixModel(techstackConfig);
  }
}

export default class PreloadableView implements ng.IDirective {
  constructor(
    private $location: ng.ILocationService,
    private $window: ng.IWindowService,
    private debouncerService: DebouncerService,
    private pageContext: PageContext) { }

    controller = PreloadableViewController;

    template() {
      return `
        <skill-matrix ng-class="{ invisible: status == 1}" 
          model="skillMatrixModel" 
          api="skillMatrixApi"></skill-matrix>
        <div class="content-window" ng-class="{ invisible: status != 1}">
          <a class="close-button" ng-href="#!/"></a>
          <div class="content-wrapper">
            <ng-view class="animate"></ng-view>
          </div>
        </div>
      `;
    }

    link = (scope: IPreloadableViewScope, element: ng.IAugmentedJQuery) => {
      this.subscribeResizeEvent(scope, element);
      this.subscribeRouteChangedEvent(scope, element);

      if (scope.location !== undefined) {
        this.$location.path(scope.location);
      }
    }

    private load = (scope: IPreloadableViewScope, element: ng.IAugmentedJQuery, shouleBeOpened: boolean) => {
      const open = () => {
        scope.status = PreloadableViewStatus.Opening;
        scope.skillMatrixApi.group(element).then(() => {
          scope.status = PreloadableViewStatus.Opened;
          scope.$apply();
        });
      };

      const close = () => {
        scope.status = PreloadableViewStatus.Closing;
        scope.skillMatrixApi.scatter().then(() => {
          scope.status = PreloadableViewStatus.Closed;
          scope.$apply();
        });
      };

      if (shouleBeOpened) {
        if (scope.status === PreloadableViewStatus.Closing) {
          var watch = scope.$watch<PreloadableViewStatus>('status', function(newValue, oldValue) {
            if (newValue === undefined || newValue === oldValue) {
              return;
            }

            if (newValue === PreloadableViewStatus.Closed) {
              open();
            }
            watch();
          });
        } else if (scope.status !== PreloadableViewStatus.Opened && scope.status !== PreloadableViewStatus.Opening) {
          open();
        }
      } else {
        if (scope.status === PreloadableViewStatus.Opened || scope.status === PreloadableViewStatus.Opening) {
          close();
        }
      }
    };

    private subscribeResizeEvent(scope: IPreloadableViewScope, element: ng.IAugmentedJQuery) {
      angular
        .element(this.$window)
        .bind('resize', this.debouncerService.debounce(e => {
          return scope.status === PreloadableViewStatus.Opened
          ? scope.skillMatrixApi.group(element)
          : scope.skillMatrixApi.scatter();
        }, 200));
    }

    private subscribeRouteChangedEvent(scope: IPreloadableViewScope, element: ng.IAugmentedJQuery) {
      scope.$on('$routeChangeStart', () => {
        let newLocation = this.$location.path().substring(1);
        let matchedRoute = this.pageContext.routes
          .filter((item: ClientStatePoint) => {
            return item.routeAddress.includes(newLocation);
          })[0];

        if (matchedRoute) {
          this.load(scope, element, matchedRoute.hasView());
        }

        scope.location = newLocation;
      });
    }

    public static Factory() {
      var key = '$inject',
      directive = (
        $location: ng.ILocationService,
        $window: ng.IWindowService,
        debouncerService: DebouncerService,
        pageContext: PageContext) =>
        new PreloadableView($location,  $window, debouncerService, pageContext);

        directive[key] = ['$location', '$window', 'debouncerService', 'pageContext'];
        return directive;
      }
    }
