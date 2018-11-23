interface IAboutScope extends ng.IScope {
  ctrl: IAboutController;
}

interface IAboutController {
  getAge(yearOfBirth: number): number;
}

export default class AboutController implements IAboutController {
  static $inject = ['$scope'];

  constructor(private $scope: IAboutScope) {
    this.$scope.ctrl = this;
  }

  getAge(yearOfBirth: number): number {
    return (new Date()).getFullYear() - yearOfBirth;
  }
}
