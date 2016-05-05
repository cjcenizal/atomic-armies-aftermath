
var isRetina = function isRetina() {
  if (window.devicePixelRatio > 1) {
    return true;
  }

  var mediaQuery =
    '(-webkit-min-device-pixel-ratio: 1.5),\
    (min--moz-device-pixel-ratio: 1.5),\
    (-o-min-device-pixel-ratio: 3/2),\
    (min-resolution: 1.5dppx)';

  if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
    return true;
  }

  return false;
}();

var images = $('.js-image');

images.forEach(function(image) {
  var $image = $(image);

  var lowRes = $image.attr('data-low-res') !== null;
  var suffix = (isRetina && !lowRes) ? '_2x' : '';
  var type = '.' + ($image.attr('data-type') || 'png');
  var src = "./assets/images/" + $image.attr('data-src') + suffix + type;
  var link = $image.attr('data-link');

  var $linkedImage = $('<a class="imageLink" target="_blank"></a>');
  $linkedImage.attr('href', link || src);

  var width = $image.attr('data-width');
  var style = width ? 'max-width:' + width + 'px; width: 100%;' : '';

  var $newImage = $('<image class="image" style="' + style + '"/>');
  $newImage.attr('src', src);

  $linkedImage.append($newImage);
  $image.replaceWith($linkedImage);
});
