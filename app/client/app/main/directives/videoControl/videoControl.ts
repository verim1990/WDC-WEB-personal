interface VideoControlScope extends ng.IScope {
  play: boolean;
  muted: boolean;
}

export default class VideoControl implements ng.IDirective {
  scope = {
    play: '=',
    muted: '='
  };

  link = (scope: VideoControlScope, elem: ng.IAugmentedJQuery) => {
    let video = <HTMLVideoElement>elem[0];

    scope.$watch('play', function (val) {
      if (val === true) {
        video.play();
      } else {
        video.pause();
      }
    });

    scope.$watch('muted', function (val) {
      if (val === true) {
        video.muted = true;
      } else {
        video.muted = false;
      }
    });
  };

  public static Factory() {
    var key = '$inject',
      directive = () => new VideoControl();

    directive[key] = [];
    return directive;
  }
}
