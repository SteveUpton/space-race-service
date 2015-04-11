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
  console.log(req.query);
  res.json({ message: generateDistanceFact(req.query.distance, req.query.time) });
});

app.use('/' + prefix, router);

app.listen(port);
console.log('Running on port ' + port);

var distanceFacts = require('./distance-data.json');

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

  sentence = "You travelled " + distance + " metres in " + util.secondsToStr(time) + ". "
  if (close) {
    sentence += "That's almost as far as " + match.thing + " travelled in " + util.secondsToStr(match.time) + "."
  } else {
    factor = match.distance/distance;
    equivalentTime = match.time/factor;
    sentence += "It would take " + match.thing + " " + util.secondsToStr(equivalentTime) + " to travel the same distance!"
  }
  return sentence;
}

console.log(generateDistanceFact(1000, 60*60));
