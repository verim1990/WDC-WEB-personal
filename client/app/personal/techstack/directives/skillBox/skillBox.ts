import { ISkillPopupApi } from './../skillPopup';
import {
    SkillBoxModel,
    ISkillBoxApi,
    SkillBoxTransition,
    SkillBoxStatus } from './models';

interface ISkillBoxScope extends ng.IScope {
    model: SkillBoxModel;
    api: ISkillBoxApi;

    // Internal
    status: SkillBoxStatus;
    transition: SkillBoxTransition;
    skillPopupApi: ISkillPopupApi;
}

export default class SkillBox implements ng.IDirective {
    scope = {
        model: '=',
        api: '='
    };

    template() {
        return `
            <skill-popup 
                url="'views/skills/' + model.skill.hardName" 
                name="model.skill.name"
                enabled="status == 0"
                api="skillPopupApi"></skill-popup>
            <div class="skill-box-wrapper">
                <div class="skill-box-overlay"></div>
                <div class="skill-box-content">
                    <div class="skill-box-header">{{model.skill.shortName}}</div>
                    <div class="skill-box-image">
                        <div class="skill-box-background {{model.skill.hardName}}"></div>
                    </div>
                    <div class="skill-box-rate">
                        <star-rating ng-model="model.skill.rate" readonly="'false'"></star-rating>
                    </div>
                </div>
            </div>`;
    }

    init(scope: ISkillBoxScope, element: ng.IAugmentedJQuery, transition: SkillBoxTransition): Promise<void> {
        let wrapper = element.find('.skill-box-wrapper'),
            overlay = element.find('.skill-box-overlay'),
            isDragging = false;

        wrapper
            .mousedown(() => {
                isDragging = true;
            })
            .mouseup(() => {
                isDragging = false;
            })
            .mouseenter(() => {
                if (scope.status === SkillBoxStatus.Scattered) {
                    wrapper.velocity('stop').velocity({ rotateZ: '0deg' }, 500);
                    overlay.velocity('stop').velocity({ opacity: 1 }, 500);
                    element.css({ 'z-index': 6 });

                    scope.skillPopupApi.show();
                }
            })
            .mouseleave(() => {
                if (scope.status === SkillBoxStatus.Scattered && !isDragging) {
                    element.css({ 'z-index': 5 });
                    wrapper.velocity('stop').velocity({ rotateZ: scope.transition.wrapper.angle + 'deg' }, 500);
                    overlay.velocity('stop').velocity({ opacity: scope.transition.overlay.opacity }, 500, null, () => {
                        element.css({ 'z-index': 4 });
                    });

                    scope.skillPopupApi.hide();
                }
            });

        return this.scatter(scope, element, transition, true);
    }

    scatter(scope: ISkillBoxScope, element: ng.IAugmentedJQuery, transition: SkillBoxTransition, immediately: boolean): Promise<void> {
        let rate = element.find('.skill-box-rate'),
            overlay = element.find('.skill-box-overlay'),
            content = element.find('.skill-box-content'),
            wrapper = element.find('.skill-box-wrapper');

        scope.transition = transition;
        scope.status = SkillBoxStatus.Scattering;

        return new Promise<void>((resolve, reject) => {
            rate.velocity('stop').velocity(transition.rate.toObject(), immediately ? 0 : 1000, 'easeInOutQuart');
            overlay.velocity('stop').velocity(transition.overlay.toObject(), immediately ? 0 : 1000, 'easeInOutQuart');
            content.velocity('stop').velocity(transition.content.toObject(), immediately ? 0 : 1000 / 2, 'easeInQuart');
            wrapper.velocity('stop').velocity(transition.wrapper.toObject(), immediately ? 0 : 1000, 'easeInOutQuart');
            element.velocity('stop').velocity(transition.toObject(), immediately ? 0 : 1000, 'easeInOutQuart', () => {
                if (scope.status !== SkillBoxStatus.Discipling) {
                    scope.status = SkillBoxStatus.Scattered;
                }

                resolve();
            });
        });
    }

    move(scope: ISkillBoxScope, element: ng.IAugmentedJQuery, transition: SkillBoxTransition, immediately: boolean): Promise<void> {
        let overlay = element.find('.skill-box-overlay'),
            content = element.find('.skill-box-content'),
            wrapper = element.find('.skill-box-wrapper');

        scope.skillPopupApi.hide();
        scope.transition = transition;
        scope.status = SkillBoxStatus.Discipling;

        return new Promise<void>((resolve, reject) => {
            overlay.velocity('stop').velocity(transition.overlay.toObject(), immediately ? 0 : 1000, 'easeInOutQuart');
            content.velocity('stop').velocity(transition.content.toObject(), immediately ? 0 : 1000 / 2, 'easeInOutQuart');
            wrapper.velocity('stop').velocity(transition.wrapper.toObject(), immediately ? 0 : 1000, 'easeInOutQuart');
            element.velocity('stop').velocity(transition.toObject(), immediately ? 0 : 1000, 'easeInOutQuart', () => {
                scope.status = SkillBoxStatus.Disciplined;

                resolve();
            });
        });
    }

    link = (scope: ISkillBoxScope, element: ng.IAugmentedJQuery) => {
        if (!scope.api) {
            scope.api = <ISkillBoxApi>{};
        }

        scope.api.init = (transition: SkillBoxTransition) =>
            this.init(scope, element, transition);
        scope.api.scatter = (transition: SkillBoxTransition) =>
            this.scatter(scope, element, transition, false);
        scope.api.move = (transition: SkillBoxTransition) =>
            this.move(scope, element, transition, scope.status === SkillBoxStatus.Disciplined);
    }

    public static Factory() {
        var key = '$inject',
            directive = () => new SkillBox();

        directive[key] = [];
        return directive;
    }
}
