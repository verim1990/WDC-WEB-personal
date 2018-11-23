import { Skill } from '../../../models';

export default class SkillBoxModel {
    constructor(public skill: Skill) { }

    static Empty(): SkillBoxModel {
        return new SkillBoxModel(Skill.Empty());
    }
};
