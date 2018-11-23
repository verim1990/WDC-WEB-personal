import { MathHelper } from '../../../../core/services';
import {
    ISkillMatrixApi,
    SkillMatrixModel,
    SkillMatrixStatus,
    SkillMatrixLayout } from './models';
import {
    SkillBoxWrapper,
    SkillBoxTransition,
    SkillBoxRateTransition,
    SkillBoxOverlayTransition,
    SkillBoxWrapperTransition,
    SkillBoxContentTransition, } from '../skillBox';

interface ISkillMatrixScope extends ng.IScope {
    model: SkillMatrixModel;
    api: ISkillMatrixApi;

    // Internal
    skillBoxWrappers: Array<SkillBoxWrapper>;
}

export default class SkillMatrix implements ng.IDirective {
    private status: SkillMatrixStatus;
    private dimension: number;
    private size: number;

    constructor(private $compile: ng.ICompileService, private mathHelper: MathHelper) {
        this.dimension = SkillMatrixLayout.x4;
        this.size = this.dimension * this.dimension;
     }

    scope = {
        model: '=',
        api: '='
    };

    template() {
        return `<div class="skill-box-template"></div>`;
    }

    init = (scope: ISkillMatrixScope, element: ng.IAugmentedJQuery) => {
        let transitionIterator = this.getTransitionIterator(element);

        for (let i = 0; i < this.size; ++i) {
            if (!scope.skillBoxWrappers) {
                scope.skillBoxWrappers = [];
            }
            scope.skillBoxWrappers[i] = new SkillBoxWrapper(scope.model.skills[i]);

            let $skillBox = $(this.$compile(`
                <skill-box 
                    model="skillBoxWrappers[${i}].model" 
                    api="skillBoxWrappers[${i}].api">`)(scope));

            $skillBox.appendTo(element);
            scope.skillBoxWrappers[i].api.init(transitionIterator.next()).then(() => {
                $skillBox.css({ 'display': 'block' });
                $skillBox.draggable({ containment: '.app' });
            });
        }
    };

    group = (scope: ISkillMatrixScope, element: ng.IAugmentedJQuery, parentElement: ng.IAugmentedJQuery): Promise<any> => {
        let $content = $(parentElement[0]).find('.content-window');
        let position = $content.position();
        let height  = $content.outerHeight(false);
        let width = $content.outerWidth(false);
        let offset = {
            left: parseInt($content.css('marginLeft'), 10),
            top: parseInt($content.css('marginTop'), 10)
        };

        const getCoordinates = (i) => new SkillBoxTransition(
            position.top + offset.top + height / this.dimension * Math.floor(i / this.dimension),
            position.left + width / this.dimension * (i % this.dimension),
            width / this.dimension, height / this.dimension,
            new SkillBoxWrapperTransition(0),
            new SkillBoxRateTransition('13'),
            new SkillBoxOverlayTransition(1),
            new SkillBoxContentTransition(0));

        this.status = SkillMatrixStatus.Discipling;

        return Promise
            .all(scope.skillBoxWrappers.slice(0, this.size).map((skill, i) => skill.api.move(getCoordinates(i))))
            .then(() => {
                this.status = SkillMatrixStatus.Disciplined;

                return Promise.resolve();
            });
    };

    scatter = (scope: ISkillMatrixScope, element: ng.IAugmentedJQuery): Promise<any> => {
        let transitionIterator = this.getTransitionIterator(element);

        this.status = SkillMatrixStatus.Scattering;

        return Promise
            .all(scope.skillBoxWrappers.slice(0, this.size).map(skill => skill.api.scatter(transitionIterator.next())))
            .then(() => {
                this.status = SkillMatrixStatus.Scattered;

                return Promise.resolve();
            });
    };

    link = (scope: ISkillMatrixScope, element: ng.IAugmentedJQuery) => {
        if (!scope.api) {
            scope.api = <ISkillMatrixApi>{};
        }

        scope.api.scatter = () =>
            this.scatter(scope, element);
        scope.api.group = (parentElement: ng.IAugmentedJQuery) =>
            this.group(scope, element, parentElement);

        this.init(scope, element);
    }

    public static Factory() {
        var key = '$inject',
            directive = ($compile: ng.ICompileService, mathHelper: MathHelper) => new SkillMatrix($compile, mathHelper);

        directive[key] = ['$compile', 'mathHelper'];
        return directive;
    }

    private getTransitionIterator(element: ng.IAugmentedJQuery) {
        let coordinates = this.generatePossibleTransitions(element);

        return {
            next: () : SkillBoxTransition => {
                return this.mathHelper.getRandomArrayElement(coordinates, true);
            }
        };
    }

    // TODO: NEED REFACTOR! 
    private generatePossibleTransitions(element: ng.IAugmentedJQuery): Array<SkillBoxTransition> {
        let coordinateArray = Array<SkillBoxTransition>();
        let template = element.find('.skill-box-template'),
            templateHeight = template.height(),
            templatewidth = template.width(),
            templateFontSize = template.css('fontSize'),
            maxX = $(element).height() - templateHeight,
            maxY = $(element).width() - templatewidth,
            minX = templateHeight * 0.3,
            minY = templatewidth * 0.3,
            minAngle = -50,
            maxAngle = 50,
            irregularity = 15,
            safeRadius = templateHeight * 1.45;

        let getMap = (radius: number) => {
            let rows = Math.floor(maxY / radius) + 1;
            let columns = Math.floor(maxX / radius) + 1;

            return {
                rows,
                columns
            };
        };

        let map = getMap(safeRadius);

        if (map.rows * map.columns < this.size) {
            map = getMap(templateHeight * 1.1);
        }

        for (let r = 1; r <= map.rows; r += 1) {
            for (let c = 1; c <= map.columns; c += 1) {
                coordinateArray.push(new SkillBoxTransition(
                    Math.round(maxX * (c - 1) / map.columns) + minX + this.mathHelper.getRandomInt(irregularity * -1, irregularity),
                    Math.round(maxY * (r - 1) / map.rows) + minY + this.mathHelper.getRandomInt(irregularity * -1, irregularity),
                    templateHeight, templatewidth,
                    new SkillBoxWrapperTransition(this.mathHelper.getRandomInt(minAngle, maxAngle)),
                    new SkillBoxRateTransition(templateFontSize),
                    new SkillBoxOverlayTransition(0.5),
                    new SkillBoxContentTransition(1)));
            }
        }

        if (coordinateArray.length < this.size) {
            for (let r = coordinateArray.length; r <= this.size; r += 1) {
                coordinateArray.push(new SkillBoxTransition(
                    this.mathHelper.getRandomInt(maxX, minX),
                    this.mathHelper.getRandomInt(maxY, minY),
                    templateHeight, templatewidth,
                    new SkillBoxWrapperTransition(this.mathHelper.getRandomInt(minAngle, maxAngle)),
                    new SkillBoxRateTransition(templateFontSize),
                    new SkillBoxOverlayTransition(0.5),
                    new SkillBoxContentTransition(1)));
            }
        }

        return coordinateArray;
    }
}
