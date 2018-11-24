
import SkillBoxTransition from './skillBoxTransition';

export default interface ISkillBoxApi {
    init: (transition: SkillBoxTransition) => Promise<any>;
    scatter: (transition: SkillBoxTransition) => Promise<any>;
    move: (transition: SkillBoxTransition) => Promise<any>;
};
