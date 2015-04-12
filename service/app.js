var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var util = require('./util.js');

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
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  
  console.log(req.query);
  match = generateMatch(req.query.distance, req.query.time);
  if (Math.abs(req.query.distance - match.distance) < (match.distance*0.1)) {
    message = constructSentence(req.query.distance, req.query.time, match, true);
  } else {
    message = constructSentence(req.query.distance, req.query.time, match, false);
  }

  points = getPoints(req.query.distance, req.query.time);
  info = getMoreInfo(match);

  res.json({ "message": message,
             "points": points,
             "info": info });
});

app.use('/' + prefix, router);

app.listen(port);
console.log('Running on port ' + port);

var distanceFacts = require('./distance-data.json');

function generateMatch(distance, time) {
  closestMatch = Infinity;
  match = null;
  distanceFacts.forEach(function(currentValue, index, array) {
    diff = Math.abs(distance - currentValue.distance);
    if (diff < (currentValue.distance*0.1)) {
      match = currentValue;
    }
  });
  if (!match) {
    match = distanceFacts[Math.floor(Math.random()*distanceFacts.length)];
  }
  return match;
}

function constructSentence(distance, time, match, close) {

  sentence = "You travelled " + distance + " metres in "
             + util.secondsToStr(time) + ". "
  if (close) {
    sentence += "That's almost as far as " + match.snippet + " travelled in "
                + util.secondsToStr(match.time) + "."
  } else {
    factor = match.distance/distance;
    equivalentTime = match.time/factor;
    sentence += "It would" + getTense(match.current) + match.snippet + " "
                + util.secondsToStr(equivalentTime)
                + " to travel the same distance!";
  }
  return sentence;

  function getTense(current) {
    if (current) {
      return " take ";
    } else {
      return " have taken ";
    }
  }
}

function getPoints(distance, time) {
  return Math.floor((distance/time) * distance^2 * 0.1);
}

function getMoreInfo(match) {
  return "Click <a href=\"" + match.url + "\">here</a> for more info on "
         + match.name;
}
