
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

var loadedImages = {};
var $document = $(document);
var $window = $(window);
var $body = $('body');
var scrollTop = $body.scrollTop();
var scrollBottom = scrollTop + $window.height();

var images = $('.js-image');
for (var i = 0; i < images.length; i++) {
  images[i] = $(images[i]);
}

function placeholder($image) {
  var width = $image.attr('data-width');
  var height = $image.attr('data-height');
  var style = 'max-width:' + width + 'px; width: 100%; height:100px;';
  $image.attr('style', style);
}

images.forEach(function($image) {
  placeholder($image);
});

function loadImage($image, index) {
  loadedImages[index] = true;
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
}

function isImageVisible($image, index) {
  var top = $image.offset().top;
  return top >= scrollTop && top <= scrollBottom;
}

function canLoadImage($image, index) {
  if (!loadedImages[index]) {
    if (isImageVisible($image, index)) {
      return true;
    }
  }

  return false;
}

function loadVisibleImages() {
  scrollTop = $body.scrollTop();
  scrollBottom = scrollTop + $window.height();

  images.forEach(function($image, index) {
    if (canLoadImage($image, index)) {
      loadImage($image, index);
    }
  });
}

loadVisibleImages();

$document.scroll(function() {
  loadVisibleImages();
});
