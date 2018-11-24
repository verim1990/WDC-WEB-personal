import { ISkillPopupApi, SkillPopupStatus } from './models';

interface ISkillPopupScope extends ng.IScope {
  name: string;
  url: string;
  enabled: boolean;
  api: ISkillPopupApi;

  // Internal
  placement: string;
  status: SkillPopupStatus;
}

export default class SkillPopup implements ng.IDirective {
  constructor(private  $templateRequest: ng.ITemplateRequestService) { }

  scope = {
    name: '=',
    url: '=',
    enabled: '=',
    api: '='
  };

  template() {
    return `
      <div class="skill-box-popover" uib-popover-template="url" 
        popover-title="{{name}}" 
        popover-placement="{{placement}}"
        popover-trigger="'show'" 
        popover-enable="enabled">
      </div>
    `;
  }

  show(scope: ISkillPopupScope, element: ng.IAugmentedJQuery): void {
    scope.status = SkillPopupStatus.Opening;

    // HACK!
    // Set correct position because jQuery mechanism causes popover spills out of container
    if (element.offset().top < 200 ) {
      scope.placement = 'bottom';
    } else {
      scope.placement = 'top';
    }

    // HACK!
    // Here we use default uib-popover-template parameter to load template, but this hack is needed to 
    // wait for template to load before showing popover (repositioning issue due to template loading delay)
    this.$templateRequest(scope.url)
      .then((template: string) => {
        if (scope.status !== SkillPopupStatus.Opening) {
          return;
        }

        scope.status = SkillPopupStatus.Opened;

        element
          .find('.skill-box-popover')
          .trigger('show');
      });
  }

  hide(scope: ISkillPopupScope, element: ng.IAugmentedJQuery): void {
    scope.status = SkillPopupStatus.Closed;

    element
      .find('.skill-box-popover')
      .trigger('hide');
  }

  link = (scope: ISkillPopupScope, element: ng.IAugmentedJQuery) => {
    if (!scope.api) {
      scope.api = <ISkillPopupApi> {};
    }

    scope.api.show = () =>
      this.show(scope, element);
    scope.api.hide = () =>
      this.hide(scope, element);
  }

  public static Factory() {
    var key = '$inject',
      directive = ($templateRequest: any) => new SkillPopup($templateRequest);

    directive[key] = ['$templateRequest'];
    return directive;
  }
}
