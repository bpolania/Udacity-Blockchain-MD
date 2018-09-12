/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const level = require('level')
var db = level('./udacity')
const util = require('util');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
		 this.address = "";
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    //this.chain = [];
		// Initialize the block height in the database
		var self = this;
		this.blocks = [];
		this.getBlockHeight(function(value) {
			if (value == null) {
				self.addBlock(new Block("First block in the chain - Genesis block"));
			}
		})

  }

	// returns all the blocks in the blockchain
	getBlockchain(callback) {
		var _this = this;
		db.createReadStream()
			.on('data', function (data) {
				console.log(data.key, '=', data.value)
				_this.blocks.push(data);
			})
			.on('error', function (err) {
				console.log('Oh my!', err)
			})
			.on('close', function () {
				console.log('Stream closed')
			})
			.on('end', function () {
				console.log('Stream ended')
				callback(_this.blocks)
			})
	}

  // Adds new block to the blockchain
  addBlock(data){
		var newBlock = new Block(data);
		var _this = this;
		this.getBlockHeight(function(height) {
			var newHeight;
			if (height == null) {
				newHeight = 0;
			} else {
				newHeight = parseInt(height, 10) + 1;
			}
			newBlock.height = newHeight;
			// UTC timestamp
			newBlock.time = new Date().getTime().toString().slice(0,-3);
			newBlock.address = data.address;
			console.log(newHeight);
			// previous block hash
			if(newHeight>0){
				var previousHashHeight = newHeight-1;
				_this.getBlock(previousHashHeight, function(block) {
					var previousHash = block.hash;
					newBlock.previousBlockHash = previousHash;//this.chain[this.chain.length-1].hash;
					newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
					db.put('height', newHeight, function (err) {
						if (err) return console.log('getBlockHeight Error: ', err) // some kind of I/O error
						db.put(newHeight.toString(), JSON.stringify(newBlock), function (err) {
							if (err) return console.log('Ooopsa!', err) // some kind of I/O error
						})
					})
				})
			} else {
				// Block hash with SHA256 using newBlock and converting to a string
				newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
				// Adding block object to chain
				// this.chain.push(newBlock);
				db.put('height', 0, function (err) {
					if (err) return console.log('getBlockHeight Error: ', err) // some kind of I/O error
					db.put("0", JSON.stringify(newBlock), function (err) {
						if (err) return console.log('Ooopsa!', err) // some kind of I/O error
					})
				})
			}

		});
  }

	// Gets blockchain height
  getBlockHeight(callback){
		// return this.chain.length-1;
		db.get('height', function (err, height) {
			if (err) {
				callback(null);
			} else {
				callback(height);
			}
		})
  }

	// gets a block by its height
	getBlock(blockHeight, callback){
		// return object as a single string
		db.get(blockHeight.toString(), function (err, block) {
			if (err) {
				console.log("blockHeight error: block not found, returning null: " + blockHeight.toString());
				callback(null)
			} else {
				callback(JSON.parse(JSON.parse(JSON.stringify(block))));
			}

		})
	}

	// gets all block that registered a star with a specific address
	getBlockByAddress(address, callback){
		var _this = this;
		db.createReadStream()
			  .on('data', function (data) {
					var json = JSON.parse(data.value);
					var _address;
					if (json.body != null) {
						_address = json.body.address;
					}
					if (_address == address) {
						console.log(_address,address)
						_this.blocks.push(data.value);
					}
			  })
			  .on('error', function (err) {
			    console.log('Oh my!', err)
			  })
			  .on('close', function () {
			    console.log('Stream closed')
			  })
			  .on('end', function () {
			    console.log('Stream ended');
					callback(_this.blocks);
			  })
	}

	// gets a block by its hash
	getBlockByHash(hash, callback){
		db.createReadStream()
			  .on('data', function (data) {
					var json = JSON.parse(data.value);
					if (json.hash == hash) {
						console.log(json.hash,hash)
						callback(data.value);
					}
			  })
			  .on('error', function (err) {
			    console.log('Oh my!', err)
			  })
			  .on('close', function () {
			    console.log('Stream closed')
			  })
			  .on('end', function () {
			    console.log('Stream ended')

			  })
	}

	// validates a block
	validateBlock(blockHeight, callback){
		// get block object
		this.getBlock(blockHeight, function(block) {
			if (block != null) {
				// get block hash
				let blockHash = block.hash;
				// remove block hash to test block integrity
				block.hash = "";
				// generate block hash
				let validBlockHash = SHA256(JSON.stringify(block)).toString();
				// Compare
				if (blockHash===validBlockHash) {
					callback(true, blockHeight, blockHash, validBlockHash);
				} else {
					callback(false, blockHeight, blockHash, validBlockHash);
				}
			}
		});
	}

	// Validates the blockchain
	validateChain(root){
		if (root == null) {
			root = 0;
		}
		var _this = this;
		this.getBlockHeight(function(height) {
			_this.validateBlock(root, function(isValid, blockHeight, blockHash, validBlockHash) {
				// compare blocks hash link
				if (!isValid) {
					return false;
					console.log("Invalid Chain");
				}
				_this.getBlock(root, function(block){
						let blockHash = block.hash;
						_this.getBlock(root+1, function(block){
							let previousHash = block.previousBlockHash;
							if (blockHash!==previousHash) {
								return false;
								console.log("Invalid Chain");
							}
							if (root == height - 1) {
								console.log("Valid Chain");
								return true;
							} else {
								_this.validateChain(root + 1);
							}
						})
					})
				})
			})
		}

		// Create JSON response object for requesting blocks with address (getBlockByAddress)
		createBlockRequestResponse(data){



		}
}


/* ===== Response Class ==============================
|  Class with a constructor for response object 		  |
|  ===============================================*/

class Response{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data.body,
		 this.address = "";
     this.time = 0,
     this.previousBlockHash = ""
    }
}
module.exports = Blockchain;
