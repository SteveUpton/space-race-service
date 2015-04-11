
module.exports.secondsToStr = function(seconds) {

  function numberEnding (number) {
    return (number > 1) ? 's' : '';
  }

  var years = Math.floor(seconds / 31536000);
  if (years) {
    return years + ' year' + numberEnding(years);
  }
  var days = Math.floor((seconds %= 31536000) / 86400);
  if (days) {
    return days + ' day' + numberEnding(days);
  }
  var hours = Math.floor((seconds %= 86400) / 3600);
  if (hours) {
    return hours + ' hour' + numberEnding(hours);
  }
  var minutes = Math.floor((seconds %= 3600) / 60);
  if (minutes) {
    return minutes + ' minute' + numberEnding(minutes);
  }
  var seconds = seconds % 60;
  if (seconds) {
    return seconds.toPrecision(2) + ' seconds';
  }
  return 'less than a second'; //'just now' //or other string you like;
};
