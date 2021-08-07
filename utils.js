const sleep = function (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}  

const makeRandomString = function (length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

exports.sleep = sleep;
exports.makeRandomString = makeRandomString;