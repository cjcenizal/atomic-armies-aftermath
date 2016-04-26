
var isRetina = function() {
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
            (min--moz-device-pixel-ratio: 1.5),\
            (-o-min-device-pixel-ratio: 3/2),\
            (min-resolution: 1.5dppx)";
    if (window.devicePixelRatio > 1)
        return true;
    if (window.matchMedia && window.matchMedia(mediaQuery).matches)
        return true;
    return false;
}();

var images = $('.js-image');

images.forEach(function(image) {
  var $image = $(image);

  var lowRes = $image.attr('data-low-res') !== null;
  var suffix = (isRetina && !lowRes) ? '_2x' : '';
  var src = "./assets/images/" + $image.attr('data-src') + suffix + ".png";

  var $linkedImage = $('<a class="imageContainer"></a>');
  $linkedImage.attr('href', src);

  var $newImage = $('<image class="image" />');
  $newImage.attr('src', src);

  $linkedImage.append($newImage);
  $image.replaceWith($linkedImage);
});
