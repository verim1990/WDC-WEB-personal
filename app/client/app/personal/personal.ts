import * as angular from 'angular';

import { StarRating } from './common';
import { SkillBox, SkillMatrix, SkillPopup, TechstackConfig } from './techstack';

export default angular.module('personal', [])
    .constant('techstackConfig', TechstackConfig)
    .directive('starRating', StarRating.Factory())
    .directive('skillBox', SkillBox.Factory())
    .directive('skillMatrix', SkillMatrix.Factory())
    .directive('skillPopup', SkillPopup.Factory())
    .name;
