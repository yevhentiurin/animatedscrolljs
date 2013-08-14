/**
* AnimatedScroll.js - Developer version
* Smooth, animated document scroll to a specific element, supporting native jQuery UI easings.
* https://github.com/yevhentiurin/animatedscrolljs
*
* Copyright (c) 2013 Yevhen Tiurin
* Licensed under the LGPL Version 3 license.
* http://www.gnu.org/licenses/lgpl.txt
*
**/

(function($) 
{
  //***************************
  $.fn.animatedScroll = function(options) 
  {
    AnimatedScroll(this.get(0), options);

    return this;
  };

  //***************************
  function AnimatedScroll(element, options)
  {
    var viewportWidth, viewportHeight, targetWidth, targetHeight, 
      documentWidth, documentHeight, targetLeft, targetTop,
      animateLeft, animateTop, animateParameters, dx, dy;

    viewportWidth = $(window).width();
    viewportHeight = $(window).height();
    targetWidth = $(element).width();
    targetHeight = $(element).height();
    documentWidth = $(document).width();
    documentHeight = $(document).height();
    targetLeft = $(element).offset().left;
    targetTop = $(element).offset().top;

    dx = (viewportWidth - targetWidth) / 2;
    dy = (viewportHeight - targetHeight) / 2;

    if (options.position && options.position.x)
    {
      if (typeof(options.position.x) == 'string')
        switch (options.position.x)
        {
          case 'left': dx = 0; break;
          case 'right': dx = -targetWidth; break;
          case 'center':
          default:
        }
      else
        dx = parseInt(options.position.x);
    }

    if (options.position && options.position.y)
    {
      if (typeof(options.position.y) == 'string')
        switch (options.position.y)
        {
            case 'top': dy = 0; break;
            case 'bottom': dy = targetHeight; break;
            case 'middle':
            default:
        }
      else
        dy = parseInt(options.position.y);
    }

    delete options.position;

    animateLeft = targetLeft - dx;
    animateLeft = animateLeft < 0 ? 0 : (animateLeft + viewportWidth > documentWidth ? documentWidth - viewportWidth : animateLeft);
    animateTop = targetTop - dy;
    animateTop = animateTop < 0 ? 0 : (animateTop + viewportHeight > documentHeight ? documentHeight - viewportHeight : animateTop);

    animateParameters = $.extend({}, options, 
      {
        step: function(now, tween)
        {
          tween.elem.scrollIntoView(true);
          
          if (typeof options.step == "function")
          {
            options.step.apply(this, arguments);
          };
        },
        complete: function()
        {
          this.scrollIntoView(true);
          $(this).remove();

          if (typeof options.complete == "function")
          {
            options.complete.apply(this, arguments);
          };
        }
      }
    );

    $("<div/>")
      .css(
        {
          visibility: 'hidden',
          position: "absolute", 
          width: viewportWidth, 
          height: viewportHeight, 
          left: $(window).scrollLeft(),
          top: $(window).scrollTop()
        }
      )
      .appendTo(document.body)
      .animate({left: animateLeft, top: animateTop}, animateParameters);
  };

})(jQuery);
