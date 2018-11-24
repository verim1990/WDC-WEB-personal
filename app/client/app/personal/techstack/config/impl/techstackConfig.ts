import { Skill, SkillCategory } from '../../models';

const techstackConfig = [
    new Skill('C#', 'C#', 'csharp', 5, [SkillCategory.Server]),
    new Skill('Angular', 'Angular', 'angular', 5, [SkillCategory.Client]),
    new Skill('Node.JS', 'Node JS', 'node', 4, [SkillCategory.Server]),
    new Skill('ECMAScript', 'Ecma script', 'es', 4, [SkillCategory.Client]),
    new Skill('React', 'React JS', 'react', 2, [SkillCategory.Client]),
    new Skill('Typescript', 'Typescript', 'ts', 5, [SkillCategory.Client]),
    new Skill('Visual Studio', 'Visual Studio', 'vs', 4, [SkillCategory.Server, SkillCategory.Software]),
    new Skill('SQL', 'SQL', 'sql', 4, [SkillCategory.Server, SkillCategory.Database]),
    new Skill('Docker', 'Docker', 'docker', 4, [SkillCategory.Software]),
    new Skill('Mongo', 'Mongo', 'mongo', 3, [SkillCategory.Server, SkillCategory.Database]),
    new Skill('Resharper', 'Resharper', 'resharper', 3, [SkillCategory.Software]),
    new Skill('JavaScript', 'Javascript', 'js', 5, [SkillCategory.Client]),
    new Skill('Webpack', 'Webpack', 'webpack', 4, [SkillCategory.Client]),
    new Skill('Jenkins', 'Jenkins', 'jenkins', 3, [SkillCategory.Server, SkillCategory.Software]),
    new Skill('Git', 'Git', 'git', 5, [SkillCategory.Software]),
    new Skill('.Net Core', '.Net Core', 'dotnetcore', 2, [SkillCategory.Software])
];

export default techstackConfig;
