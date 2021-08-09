const sleep = function (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}  

const randomString = function (length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const randomInteger = function (min, max, maxIncluded = true) {
  if(maxIncluded)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  else
    return Math.random() * (max - min) + min;
}

const randomBoolean = function(){
  return Math.random() < 0.5;
}

const roundNext = function(i, m, n){ //i=initial value; m=step (absolute value); n=max value
  return (i+m-1) % n+1;
}

const roundPrev = function(i, m, n){ //i=initial value; m=step (absolute value); n=max value
  return (i-m+n-1) % n+1;
}

const roundNumber = function(num, scale) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

exports.sleep = sleep;
exports.randomString = randomString;
exports.randomInteger = randomInteger;
exports.randomBoolean = randomBoolean;
exports.roundNext = roundNext;
exports.roundPrev = roundPrev;
exports.roundNumber = roundNumber;