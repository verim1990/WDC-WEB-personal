interface StartRatingScope extends ng.IScope {
  value: number;
  size: number;
  readonly: boolean;
  text: string;

  // Internal
  stars: any[];
  set: (value: number) => void;
}

export default class StartRating implements ng.IDirective {
  scope = {
    value: '=ngModel',
    size: '=?',
    readonly: '=?',
    text: '=?'
  };

  template() {
    return `
      <ul class="star-rating" ng-class="{readonly: readonly}">
        <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="set($index)">
          <i class="fa fa-star"></i>
        </li>
      </ul>
      <span ng-if="text" style="display: inline; padding-left: 5px;">
        {{text}}
      </span>
    `;
  };

  init(scope: StartRatingScope) {
    scope.stars = [];

    for (var i = 0; i < scope.size; i++) {
      scope.stars.push({
        filled: i < scope.value
      });
    }
  };

  link = (scope: StartRatingScope, elem: ng.IAugmentedJQuery) => {
    if (scope.size === undefined) {
      scope.size = 5;
    }

    scope.set = (index) => {
      if (scope.readonly === undefined || scope.readonly === false) {
        scope.value = index + 1;
      }
    };

    scope.$watch('value', (oldValue: number, newValue: number) => {
      if (newValue || newValue === 0) {
        this.init(scope);
      }
    });
  };

  public static Factory() {
    var key = '$inject',
      directive = () => new StartRating();

    directive[key] = [];
    return directive;
  }
}
