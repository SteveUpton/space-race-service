var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

var prefix = "api";

router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

router.get('/', function(req, res) {

});

router.route('/run').get(function(req, res) {
  console.log(req.query);
  res.json({ message: generateDistanceFact(req.query.distance, req.query.time) });
});

app.use('/' + prefix, router);

app.listen(port);
console.log('Running on port ' + port);

var distanceFacts = [
  { thing: "Curiosity",
    distance: 8600,
    time: 951*86400,
    url: "http://mars.nasa.gov/msl/mission/mars-rover-curiosity-mission-updates/" },
  { thing: "Opportunity",
    distance: 42000,
    time: 3984*86400,
    url: "www.example.com" },
  { thing: "Lunokhod 1",
    distance: 10540,
    time: 322*86400,
    url: "www.example.com" },
  { thing: "Lunokhod 2",
    distance: 39000,
    time: 120*86400,
    url: "www.example.com" },
  { thing: "the International Space Station",
    distance: 27600000*24,
    time: 86400,
    url: "www.example.com" }
];

function generateDistanceFact(distance, time) {
  closestMatch = Infinity;
  match = null;
  close = false;
  distanceFacts.forEach(function(currentValue, index, array) {
    diff = Math.abs(distance - currentValue.distance);
    if (diff < (currentValue.distance*0.1)) {
      close = true;
      match = currentValue;
    }
  });
  if (!match) {
    match = distanceFacts[Math.floor(Math.random()*distanceFacts.length)];
  }
  return constructSentence(distance, time, match, close);
}

function constructSentence(distance, time, match, close) {

  sentence = "You travelled " + distance + " metres in " + secondsToStr(time) + ". "
  if (close) {
    sentence += "That's almost as far as " + match.thing + " travelled in " + secondsToStr(match.time) + "."
  } else {
    factor = match.distance/distance;
    equivalentTime = match.time/factor;
    sentence += "It would take " + match.thing + " " + secondsToStr(equivalentTime) + " to travel the same distance!"
  }
  return sentence;
}

console.log(generateDistanceFact(1000, 60000));

function secondsToStr(seconds) {

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
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less than a second'; //'just now' //or other string you like;
}
