require('./preloader.scss');
// require('./loaders/balls/loading-balls.js');
require('./loaders/bar/loading-bar.js');
// require('./loaders/centered-bar/loading-bar.js');
// require('./loaders/double-ring/loading-ring.js');
// require('./loaders/ring/loading-ring.js');

(function($) {
  // Defining namespace
  $.loadingpage = $.loadingpage || {};

  var lp = $.loadingpage, // Namespace shortcut

    // Global variables
    items = [],
    itemIterator = 0,
    options = {},
    preloaderContainer = '',

    // Default options
    defaultOptions = {
      graphic: 'bar',
      backgroundColor: '#000',
      foregroundColor: '#fff',
      pageEffect: 'none',
      text: true,
      deepSearch: true,
      onComplete: () => { } // callback for loading page complete
    };

  // Helper used to call appropriate methods in graphical preloader implementations
  lp.graphicAction = function(action, params) {
    if(typeof lp.graphics != 'undefined' && typeof lp.graphics[options.graphic] != 'undefined' && lp.graphics[options.graphic].created) {
      lp.graphics[options.graphic][action](params);
    }
  };

  // Applies animation to app element after preloading completed
  lp.applyAnimationToElement = function(animName) {
    $('.app').addClass(`lp-${animName}`);
  };

  // Completes preloading of all items
  lp.completePreloading = function() {
    lp.graphicAction('complete', function() {
      lp.applyAnimationToElement(options.pageEffect);
      options.onComplete();
    });
  };

  // Completes preloading of single item
  lp.completeSingleItemPreloading = function() {
    var percentage = ++itemIterator / items.length * 100;
    lp.graphicAction('set', percentage);

    // If current item is the last one then destroy preloader container and trigger 'preloading completed' event
    if(itemIterator == items.length) {
      lp.destroyPreloaderContainer();
      lp.completePreloading();
    }
  };

  // Adds item to preloader queue
  lp.addItemToPreloaderQueue = function(url) {
    $('<img />')
      .attr('src', url)
      .bind('load', function() {
        lp.completeSingleItemPreloading();
      })
      .appendTo(preloaderContainer);
  };

  // Destroys preloader container and triggers 'on load completed' event
  lp.destroyPreloaderContainer = function() {
    $(preloaderContainer).remove();
  };

  // Creates preloader container and tries to get (by AJAX) all collected to preload items
  lp.createPreloaderContainer = function() {
    preloaderContainer = $('<div></div>')
      .appendTo('.app')
      .css({
        display: 'none',
        width: 0,
        height: 0,
        overflow: 'hidden'
      });

    for(var i = 0; items.length > i; i++) {
      if(items[i].indexOf(document.domain) == -1) { // If image isn't from current domain, then skip it preloading
        lp.completeSingleItemPreloading();
        continue;
      }

      $.ajax({
        url: items[i] + ((/\?/.test(items[i])) ? '&' : '?') + 'rand=' + Math.random(),
        type: 'HEAD',
        timeout: 3000,
        complete(data) {
          if(data.status == 200) {
            lp.addItemToPreloaderQueue(this.url);
          } else {
            lp.completeSingleItemPreloading();
          }
        }
      });
    }
  };

  // Finds images in given element and populates 'items' array with image urls
  lp.findImagesInElement = function(element) {
    var url = '';

    if($(element).css('background-image') != 'none') {
      var backImg = $(element).css('background-image');
      if(/\.(png|gif|jpg|jpeg|bmp)/i.test(backImg)) {
        url = backImg;
      }
    } else if(typeof ($(element).attr('src')) != 'undefined' && element.nodeName.toLowerCase() == 'img') {
      url = $(element).attr('src');
    }

    if(url.indexOf('gradient') == -1) {
      url = url.replace(/url\(\"/g, '');
      url = url.replace(/url\(/g, '');
      url = url.replace(/\"\)/g, '');
      url = url.replace(/\)/g, '');

      var urls = url.split(', ');

      for(let i = 0; i < urls.length; i++) {
        if(urls[i].length > 0 && items.indexOf(urls[i]) == -1) {
          items.push(urls[i]);
        }
      }
    }
  };

  // Main plugin entry
  // For given elements tries to find local images, enqueues them into preloader container and preload them asynchronously
  $.fn.loadingpage = function(o) {
    options = $.extend(defaultOptions, o || {});

    this.each(function() {
      lp.findImagesInElement(this);

      if(options.deepSearch == true) {
        $(this).find('*:not(script)')
          .each(function() {
            lp.findImagesInElement(this);
          });
      }
    });

    lp.createPreloaderContainer();

    return this;
  };

  // Check app availability helper
  var checkAppAvailability = function() { // Check for app existence and insert the loading screen if enabled
    var $app = $('.app');

    if($app.length) {
      options = $.extend(defaultOptions, {});
      options.text *= 1;

      if(typeof lp.graphics != 'undefined' && typeof lp.graphics[options.graphic] != 'undefined') {
        lp.graphics[options.graphic].create(options);
        $app.css('visibility', 'visible');
      } else {
        setTimeout(function() {
          checkAppAvailability();
        }, 50);
      }
    } else {
      setTimeout(function() {
        checkAppAvailability();
      }, 50);
    }
  };
  checkAppAvailability();

  $(document).ready(function() {
    $('.app').loadingpage();
  });
})(jQuery);
