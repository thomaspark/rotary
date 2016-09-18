var rotateDial = function(rotary, event, hole) {
  var rotation = getRotationDegrees(hole.parent());
  var offset = (55 - getRotationDegrees(hole.parent()) + 360) % 360;
  var pageX = event.pageX || event.originalEvent.touches[0].pageX;
  var pageY = event.pageY || event.originalEvent.touches[0].pageY;
  var x = pageX - rotary.offset().left - rotary.width()/2;
  var y = -1*(pageY - rotary.offset().top - rotary.height()/2);
  var theta = Math.atan2(y,x) * (180/Math.PI);
  var cssDegs = convertThetaToCssDegs(theta, rotation);
  var dial = rotary.find('.dial');

  if (cssDegs > (offset + 55) || cssDegs < 0 || cssDegs < getRotationDegrees(dial)) {
    return;
  }

  var rotate = 'rotate(' +cssDegs + 'deg)';
  dial.css({'transform' : rotate, '-webkit-transform': rotate, '-moz-transform': rotate, '-ms-transform': rotate});
};

var convertThetaToCssDegs = function(theta, rotation) {
  var cssDegs = (90 - theta - rotation);
  cssDegs = (cssDegs + 360) % 360;
  return cssDegs;
};

var getRotationDegrees = function(obj) {
  var angle;
  var el = obj[0];
  var st = window.getComputedStyle(el, null);

  var matrix = st.getPropertyValue("-webkit-transform") ||
               st.getPropertyValue("-moz-transform") ||
               st.getPropertyValue("-ms-transform") ||
               st.getPropertyValue("-o-transform") ||
               st.getPropertyValue("transform");

  if (matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
  } else {
    angle = 0;
  }

  return (angle < 0) ? angle + 360 : angle;
};

var calculateNum = function(input, dial) {
  var base = 40;
  var interval = 30;
  var deg = getRotationDegrees(dial);
  var num = 0;

  if (deg < base) return;
  else if (deg < base + 1*interval) {num = 1;}
  else if (deg < base + 2*interval) {num = 2;}
  else if (deg < base + 3*interval) {num = 3;}
  else if (deg < base + 4*interval) {num = 4;}
  else if (deg < base + 5*interval) {num = 5;}
  else if (deg < base + 6*interval) {num = 6;}
  else if (deg < base + 7*interval) {num = 7;}
  else if (deg < base + 8*interval) {num = 8;}
  else if (deg < base + 9*interval) {num = 9;}

  return num;
};

var init = function() {
  $('.controls').show();
  $('body').removeClass('nojs');

  $('[data-rotary]').each(function() {
    var input = $(this);
    var parent = $(input.attr('data-rotary'));
    var rotary = parent.find(".rotary");

    rotary.on('mousedown touchstart', '.hole', function(e) {
      e.preventDefault();

      var dial = rotary.find('.dial');
      var hole = $(this);

      if (getRotationDegrees(dial) !== 0) {
        return;
      }

      dial.removeClass('smooth');

      $('body').on('mousemove touchmove', function(e) {
        rotateDial(rotary, e, hole);
      });

      $(document).one('mouseup touchend', function() {
        var num = calculateNum(input, dial);
        $('body').off('mousemove touchmove');
        dial.addClass('smooth').attr('style', '');
        dial.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
          if (typeof num !== 'undefined') {
            input.val("" + input.val() + num).change();
          }
        });

      });
    });

    input.on('change', function() {
      var number = input.val();

      if (number.length === 0) {
        $('#call').removeAttr("href");
      } else {
        $('#call').attr("href", "tel:" + number);
      }
    });
  });
};

$(document).ready(function() {
  init();
});
