export default interface ISkillMatrixApi {
    scatter: () => Promise<any>;
    group: (parentElement: ng.IAugmentedJQuery) => Promise<any>;
}
