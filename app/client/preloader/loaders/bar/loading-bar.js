(function($) {
  $.loadingpage = $.loadingpage || {};
  $.loadingpage.graphics = $.loadingpage.graphics || {};
  $.loadingpage.graphics.bar = {
    created: false,
    attr: {},
    create: function(options) {
      options.backgroundColor = options.backgroundColor || '#000000';
      options.foregroundColor = options.foregroundColor || '#FFFFFF';
      options.height = options.height || 1;
      options.backgroundOpacity	= options.backgroundOpacity || 1;

      var style = {
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 666999,
        backgroundColor: options.backgroundColor,
        opacity: options.backgroundOpacity
      };

      if(options.backgroundImage) {
        style.backgroundImage = `url('${options.backgroundImage}')`;
        style['background-repeat'] = options.backgroundRepeat == 0 ? 'no-repeat' : '';
        style['background-position'] = 'center center';

        if(style['background-repeat'].toLowerCase() == 'no-repeat'
          && typeof options.fullscreen !== 'undefined'
          && options.fullscreen * 1 == 1) {
          style['background-attachment'] = 'fixed';
          style['-webkit-background-size'] = 'cover';
          style['-moz-background-size'] = 'cover';
          style['-o-background-size'] = 'cover';
          style['background-size'] = 'cover';
        }
      }

      this.attr.overlay = $('<div></div>')
        .css(style)
        .appendTo('body');

      this.attr.bar = $('<div></div>').css({
        height: `${options.height}px`,
        marginTop: `-${options.height / 2}px`,
        backgroundColor: options.foregroundColor,
        width: '0%',
        position: 'absolute',
        top: '50%' })
      .appendTo(this.attr.overlay);

      if(options.text) {
        this.attr.text = $('<div></div>')
        .text('0%')
        .css({
          height: '40px',
          width: '100px',
          position: 'absolute',
          fontSize: '3em',
          top: '50%',
          left: '50%',
          marginTop: `-${59 + options.height}px`,
          textAlign: 'center',
          marginLeft: '-50px',
          color: options.foregroundColor })
        .appendTo(this.attr.overlay);
      }

      this.created = true;
    },
    set: function(percentage) {
      this.attr.bar.stop().animate({
        width: `${percentage}%`,
        minWidth: `${percentage}%`
      }, 200);

      if(this.attr.text) {
        this.attr.text.text(`${Math.ceil(percentage)}%`);
      }
    },
    complete: function(callback) {
      var that = this;
      var result = callback();

      this.attr.overlay.fadeOut(500, () => that.attr.overlay.remove());
    }
  };
})(jQuery);