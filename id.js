const level = require('level')
var db = level('./id')
var bitcoin = require('bitcoinjs-lib')
var bitcoinMessage = require('bitcoinjs-message')

  /* ===== IdValidationRequest Class ===============================
  |  Class with a constructor for an Id Validation Request			   |
  |  ==============================================================*/

  class IdValidationRequest {
  	constructor(address,expiration){
      var d = new Date();
      var t = d.getTime();
      this.address = address;
      this.requestTimeStamp = t;
      this.message = Messages.createMessage(address,t);
      this.validationWindow = expiration;
      this.status = -1;
    }

    validateUserRequest(blockchainId, callback) {
      var validate = new Validate();
      var validation = this;
      validate.getValidation(blockchainId, function(response) {
        if (response != null) {
          if (response.status == -1) {
            var d = new Date();
            var currentTimeStamp = d.getTime();
            var timeStampDiff = (currentTimeStamp - response.requestTimeStamp)/1000;
            var validationWindow = timeStampDiff - response.validationWindow;
            if (validationWindow < 0) {
              response.validationWindow = Math.floor(validationWindow * -1);
            } else {
              response.validationWindow  = 300;
              response.requestTimeStamp = currentTimeStamp;
            }
            validation = response
          }
        }
        var v = {};
        v.address = validation.address;
        v.requestTimeStamp = validation.requestTimeStamp;
        v.message = validation.message;
        v.validationWindow = 300;
        v.status = -1;
        db.put(blockchainId, JSON.stringify(v), function (err) {
          if (err) return console.log('DB error: ', err) // some kind of I/O error
          callback(validation);
        })

      })
    }
  }

  /* ===== Validate Class ===============================
  |  Class with a constructor for a Validate Object			|
  |  ===================================================*/

  class Validate {
    validateMessage(address,signature,callback) {
      db.get(address, function (err, data) {
  			if (err) {
          console.log(err);
  				console.log(bitcoinMessage.verify(message, address, signature))
  			} else {
          var json = JSON.parse(data)
          var message = Messages.createMessage(address,json.requestTimeStamp);
          var result = bitcoinMessage.verify(message, address, signature);
          var messageSignature = "invalid";
          var d = new Date();
          var currentTimeStamp = d.getTime();
          var timeStampDiff = (currentTimeStamp - json.requestTimeStamp)/1000;
          var validationWindow = json.validationWindow - timeStampDiff;
          if (validationWindow > 0) {
            messageSignature = "valid";
            json.status = 0;
          } else {
            result = false;
            validationWindow = 0;
          }
          db.put(address, JSON.stringify(json), function (err) {
            if (err) return console.log('DB error: ', err) // some kind of I/O error
          })
          var status = new ValidateResponseStatus(address,json.requestTimeStamp,message,messageSignature,Math.round(validationWindow));
          var response = new ValidateResponse(result,status);
          callback(response);
  			}
  		})
    }

    getValidation(address,callback) {
      db.get(address, function (err, data) {
        if (err) {
          console.log(err);
          callback(null)
  			} else {
            callback(JSON.parse(data))
  			}
  		})
    }

    updateValidation(address,validation,callback) {
      db.put(address, validation, function (err, data) {
  			if (err) {
          console.log(err);
  			} else {
          callback(true);
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
    constructor(address,timestamp,message,messageSignature,expiration) {
      this.address = address,
      this.requestTimeStamp = timestamp,
      this.message = message,
      this.validationWindow = expiration,
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
