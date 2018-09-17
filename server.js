'use strict';

const Blockchain = require('./simpleChain.js');
var Id = require('./id.js');

const Hapi = require('hapi');

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});

class BlockData {
  constructor(address,star) {
    this.address = address,
    this.star = star
  }
}

server.route({
    method: 'GET',
    path: '/chain',
    handler: async function (request, h)  {
        const promise = new Promise((resolve, reject) => {
          if (request.params.name != 'favicon.ico') {
            var chain = new Blockchain();
            chain.getBlockchain(function(block){
              resolve(block);
            })
          }
        }).then(function(result) {
          console.log(result); // "Stuff worked!"
          return result;
        }, function(err) {
          console.log(err); // Error: "It broke"
          return err;
        });
        return promise;
    }
});

server.route({
    method: 'GET',
    path: '/block/{height}',
    handler: async function (request, h)  {
        const promise = new Promise((resolve, reject) => {
          if (request.params.name != 'favicon.ico') {
            var chain = new Blockchain();
            chain.getBlock(request.params.height, function(block){
              resolve(block);
            })
          }
        });
        return promise;
    }
});

server.route({
    method: 'GET',
    path: '/stars/address:{address}',
    handler: async function (request, h)  {
        const promise = new Promise((resolve, reject) => {
          if (request.params.name != 'favicon.ico') {
            var chain = new Blockchain();
            chain.getBlockByAddress(request.params.address, function(block){
              resolve(block);
            })
          }
        }).then(function(result) {
          console.log(result); // "Stuff worked!"
          return result;
        }, function(err) {
          console.log(err); // Error: "It broke"
          return err;
        });
        return promise;
    }
});

server.route({
    method: 'GET',
    path: '/stars/hash:{hash}',
    handler: async function (request, h)  {
        const promise = new Promise((resolve, reject) => {
          if (request.params.name != 'favicon.ico') {
            var chain = new Blockchain();
            chain.getBlockByHash(request.params.hash, function(block){
              resolve(block);
            })
          }
        }).then(function(result) {
          console.log(result); // "Stuff worked!"
          return result;
        }, function(err) {
          console.log(err); // Error: "It broke"
          return err;
        });
        return promise;
    }
});

server.route({
    path: '/block',
    method: 'POST',
    handler: ( request, reply ) => {
      const promise = new Promise((resolve, reject) => {
        if (request.params.name != 'favicon.ico') {
          var verified = Messages.verifyStarData(request.payload);
          if (!verified) {
            resolve(JSON.parse("{ \"error\" : \"Bad request, some fields may be missing from your request\"}"));
            return;
          }
          if(!Messages.ascii(request.payload.star.story)) {
            resolve(JSON.parse("{ \"error\" : \"You tried to encode a non-ASCII string! I know, the project specs wasn't clear about this one (among many other things), but anyway you cannot do it, check your string and try again!\"}"));
            return;
          }
          const encoded = new Buffer(request.payload.star.story).toString('hex');
          var star = request.payload.star;
          star.story = encoded;
          var data = new BlockData(request.payload.address,star);
          var chain = new Blockchain();
          chain.addStar(data, function(block){
            resolve(block);
          })
        }
      }).then(function(result) {
        console.log(result); // "Stuff worked!"
        return result;
      }, function(err) {
        console.log(err); // Error: "It broke"
        return err;
      });
      return promise;
    }
});

server.route({
    path: '/requestValidation',
    method: 'POST',
    handler: ( request, reply ) => {
        // This is a ES6 standard
        const promise = new Promise((resolve, reject) => {
          if (request.params.name != 'favicon.ico') {
            var verified = Messages.verifyRequestValidation(request.payload);
            if (!verified) {
              resolve(JSON.parse("{ \"error\" : \"Bad request, address may be missing from your request\"}"));
              return;
            }
            var id = new Id.IdValidationRequest(request.payload.address,300);
            id.validateUserRequest(request.payload.address,function(response){
              console.log(response);
              resolve(response);
            });

          }
        });
        return promise;
    }
});

server.route({
    path: '/message-signature/validate',
    method: 'POST',
    handler: async function ( request, reply ) {
        // This is a ES6 standard
        const promise = new Promise((resolve, reject) => {
          if (request.params.name != 'favicon.ico') {
            var verified = Messages.verifyValidate(request.payload);
            if (!verified) {
              resolve(JSON.parse("{ \"error\" : \"Bad request, some fields may be missing from your request\"}"));
              return;
            }
            var id = new Id.Validate();
            id.validateMessage(request.payload.address,request.payload.signature, function(response){
              resolve(response);
            });
          }
        });
        return promise;
    }
});

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});


var Messages = {
  verifyStarData: function (body) {
    if (!body) {
      return false;
    }
    if (body.address === "" || !body.address) {
      return false;
    }
    if (body.star === "" || !body.star) {
      return false;
    }
    if (body.star.ra === "" || !body.star.ra) {
      return false;
    }
    if (body.star.dec === "" || !body.star.dec) {
      return false;
    }
    if (body.star.story === "" || !body.star.story) {
      return false;
    }
    return true;
  },
  verifyRequestValidation(body) {
    if (!body || body.address === "" || !body.address) {
      return false;
    }
    return true;
  },verifyValidate(body) {
    if (!body) {
      return false;
    }
    if (body.address === "" || !body.address) {
      return false;
    }
    if (body.signature === "" || !body.signature) {
      return false;
    }
    return true;
  },
  ascii: function (string) {
    return /^[\x00-\x7F]*$/.test(string);
  }
}

init();
