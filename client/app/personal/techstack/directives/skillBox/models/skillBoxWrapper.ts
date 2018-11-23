import SkillBoxModel from './skillBoxModel';
import ISkillBoxApi from './skillBoxApi';
import { Skill } from '../../../models';

export default class SkillBoxWrapper {
    public model: SkillBoxModel;
    public api: ISkillBoxApi;

    constructor(skill: Skill = null) {
        this.api = <ISkillBoxApi>{};

        if (!skill) {
            this.model = SkillBoxModel.Empty();
        } else {
            this.model = new SkillBoxModel(skill);
        }
    }
}
