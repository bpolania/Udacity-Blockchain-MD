const level = require('level')
var db = level('./id')

  /* ===== IdValidationRequest Class ===============================
  |  Class with a constructor for an Id Validation Request			   |
  |  ==============================================================*/

  class IdValidationRequest {
  	constructor(address,expiration){
      var d = new Date();
      var t = d.getTime()
      this.address = address;
      this.requestTimeStamp = t;
      this.message = Messages.createMessage(address,t);
      this.validationWindow = expiration;
    }

    validateUserRequest(blockchainId) {
      db.put(blockchainId, this.requestTimeStamp, function (err) {
        if (err) return console.log('DB error: ', err) // some kind of I/O error
      })
      return JSON.stringify(this);
    }
  }

  /* ===== Validate Class ===============================
  |  Class with a constructor for a Validate Object			|
  |  ===================================================*/

  class Validate {
    validateMessage(address,signature,callback) {
      var address = address;
      var signature = signature;
      db.get(address, function (err, timestamp) {
  			if (err) {
          console.log(err);
  				console.log(bitcoinMessage.verify(message, address, signature))
  			} else {
          var message = Messages.createMessage(address,timestamp);
          var result = bitcoinMessage.verify(message, address, signature);
          var messageSignature = "invalid";
          if (result) {
            var messageSignature = "valid";
          }
          var status = new ValidateResponseStatus(address,timestamp,message,messageSignature);
          var response = new ValidateResponse(result,status);
          console.log(message);
  				console.log(result);
          callback(JSON.stringify(response));
  			}
  		})
    }
  }

  /* ===== ValidateResponse Class ===============================
  |  Class with a constructor for a ValidateResponse Object			|
  |  ===========================================================*/

  class ValidateResponse {
    constructor(registerStar,status) {
      this.registerStar = registerStar,
      this.status = status
    }
  }

  /* ===== ValidateResponseStatus Class ===============================
  |  Class with a constructor for a ValidateResponseStatus Object			|
  |  =================================================================*/

  class ValidateResponseStatus {
    constructor(address,timestamp,message,messageSignature) {
      this.address = address,
      this.requestTimeStamp = timestamp,
      this.message = message,
      this.validationWindow = 0,
      this.messageSignature = messageSignature
    }
  }

  /* ===== Messages Class ===================================
  |  Static class with a constructor for a Messages Object	|
  |  =======================================================*/

  var Messages = {
    createMessage: function (address,timestamp) {
      return address + ":" + timestamp + ":starRegistry";
    }
  }

  module.exports = {
    IdValidationRequest : IdValidationRequest,
    Validate : Validate
  }
