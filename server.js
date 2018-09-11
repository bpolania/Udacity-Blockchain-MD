'use strict';

const Blockchain = require('./simpleChain.js');
var Id = require('./id.js');

const Hapi = require('hapi');

const server = Hapi.server({
    port: 8000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return 'Hello, world!';
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: async function (request, h)  {
        const promise = new Promise((resolve, reject) => {
          if (request.params.name != 'favicon.ico') {
            var chain = new Blockchain();
            chain.getBlock(request.params.name, function(block){
              resolve(block);
            })
          }
        });
        return promise;
    }
});

server.route({
    path: '/block',
    method: 'POST',
    handler: ( request, reply ) => {
        // This is a ES6 standard
        console.log(request.payload.body);
        var chain = new Blockchain();
        chain.addBlock(request.payload.body);
        return null
    }
});

server.route({
    path: '/requestValidation',
    method: 'POST',
    handler: ( request, reply ) => {
        // This is a ES6 standard
        var id = new Id.IdValidationRequest(request.payload.address,300);
        var message = id.validateUserRequest();
        console.log(message);
        return message;
    }
});

server.route({
    path: '/message-signature/validate',
    method: 'POST',
    handler: ( request, reply ) => {
        // This is a ES6 standard
        var id = new Id.Validate();
        id.validateMessage(request.payload.address,request.payload.signature);
        // console.log(message);
        return null;
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
