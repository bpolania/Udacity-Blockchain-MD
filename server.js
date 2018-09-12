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
        });;
        return promise;
    }
});

server.route({
    path: '/block',
    method: 'POST',
    handler: ( request, reply ) => {
        // This is a ES6 standard
        console.log(request.payload.address);
        console.log(request.payload.star);
        var data = new BlockData(request.payload.address,request.payload.star);
        var chain = new Blockchain();
        chain.addBlock(data);
        return null
    }
});

server.route({
    path: '/requestValidation',
    method: 'POST',
    handler: ( request, reply ) => {
        // This is a ES6 standard
        var id = new Id.IdValidationRequest(request.payload.address,300);
        var message = id.validateUserRequest(request.payload.address);
        console.log(message);
        return message;
    }
});

server.route({
    path: '/message-signature/validate',
    method: 'POST',
    handler: async function ( request, reply ) {
        // This is a ES6 standard
        const promise = new Promise((resolve, reject) => {
          if (request.params.name != 'favicon.ico') {
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

init();
