import { SkillCategory } from './skillCategory';

export class Skill {
    constructor(
        public shortName: string,
        public name: string,
        public hardName: string,
        public rate: number,
        public categories: Array<SkillCategory> = []) { }

        static Empty(): Skill {
            return new Skill('', '', '', 0);
        }
};
