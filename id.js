const level = require('level')
var db = level('./id')

  /* ===== IdValidationRequest Class ===============================
  |  Class with a constructor for an Id Validation Request			   |
  |  ==============================================================*/

  class IdValidationRequest{
  	constructor(address,expiration){
      var d = new Date();
      var t = d.getTime()
      this.address = address;
      this.requestTimeStamp = t;
      this.message = Messages.createMessage(address,t);
      this.validationWindow = expiration;
    }

    validateUserRequest() {
      db.put('blockchainId', this.requestTimeStamp, function (err) {
        if (err) return console.log('DB error: ', err) // some kind of I/O error
      })
      return JSON.stringify(this);
    }
  }

  class Validate {
    validateMessage(address,signature) {
      var address = address;
      var signature = signature;
      db.get('blockchainId', function (err, timestamp) {
  			if (err) {
          console.log(err);
  				console.log(bitcoinMessage.verify(message, address, signature))
  			} else
        var message = Messages.createMessage(address,timestamp)
          console.log(message);
  				console.log(bitcoinMessage.verify(message, address, signature))
  			}
  		})
    }
  }

  var Messages = {
    createMessage: function (address,timestamp) {
      return address + ":" + timestamp + ":starRegistry";
    }
  }

  module.exports = {
    IdValidationRequest : IdValidationRequest,
    Validate : Validate
  }
