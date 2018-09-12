# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].
* For installing levelDB just follow the instructions in their (Github repo)[https://github.com/Level/levelup/blob/master/README.md].
* Finally you need to install Hapi, following these very simple instructions in (their website)[https://hapijs.com/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install Hapi with --save flag
```
npm install hapi --save
```

- Install bitcoinjs-message with --save flag
```
npm i bitcoinjs-message --save
```

- Install bitcoinjs-lib with --save flag
```
npm install bitcoinjs-lib --save
```

### Start the Server

* Open a console an navigate to the server project root folder:

```
cd /path/to/server/Project_3_submission
```

* Run `node server.js`

* Done and done!!!

## Testing webservices end-points

- Create a new block

To create a new block, you must do a `POST` request to the following endpoint:

```
http://localhost:8000/block
```

Withe the following header:

```
'Content-Type: application/json'
```

With any JSON value as a body, here is an example using `curl`:

```
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"another block the dust"}'
```

- Get a block by height

Open a browser session and go to:

```
http://localhost:8000/block/{block_height}
```

Where `block_height` is the height of the block you wish to get.

- Get a block by address

Open a browser session and go to:

```
http://localhost:8000/stars/address:{address}
```

Where `address` is the address of the block you wish to get.

- Get a block by hash

Open a browser session and go to:

```
http://localhost:8000/stars/hash:{hash}
```

Where `hash` is the hash of the block you wish to get.

- Request an user validation  

To request an user validation an user, you must do a `POST` request to the following endpoint:

```
http://localhost:8000/requestValidation
```

Withe the following header:

```
'Content-Type: application/json'
```

With the following body:

```
{ "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ" }
```

where `address` in the value of the address of the user you need to validate, here is an example using `curl`:

```
curl -X "POST" "http://localhost:8000/requestValidation" -H 'Content-Type: application/json; charset=utf-8' -d $'{"address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"}'
```

This is a sample response:

```
{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", // This is the address of the wallet
  "requestTimeStamp": "1532296090", // the timestamp of the request
  "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry", // this is the message that needs to be signed
  "validationWindow": 300 // expiration time of the request
}
```

- Validate a signature  

To validate an signature, you must do a `POST` request to the following endpoint:

```
http://localhost:8000/message-signature/validate
```

Withe the following header:

```
'Content-Type: application/json'
```

With the following body:

```
{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU="
}
```

where `address` in the value of the address of the signature you need to validate, and `signature` is the signature you need to validate, here is an example using `curl`:

```
curl -X "POST" "http://localhost:8000/message-signature/validate" -H 'Content-Type: application/json; charset=utf-8' -d $'{ "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ","signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU="}'
```

This is a sample response:

```
{
  "registerStar": true, // was the registration successful?
  "status": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", // This is the address of the wallet
    "requestTimeStamp": "1532296090", // the timestamp of the request
    "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry", // the signed messaged
    "validationWindow": 193, // expiration time of the request
    "messageSignature": "valid" // is the signature valid?
  }
}
```

- Register a Star

To validate an signature, you must do a `POST` request to the following endpoint:

```
http://localhost:8000/block
```

Withe the following header:

```
'Content-Type: application/json'
```

With the following body:

```
{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "star": {
    "dec": "-26° 29'\'' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
```

where `address` in the value of the address of the signature you need to validate, and `star` is the information of the star you need to register (this information can be found at https://www.google.com/sky/) please note that `story` can be any `string` value that should contain some historical information about the star in question, and declination (`dec`) and right ascension (`ra`) are required, but there are some optional values that can be added, magnitude (`magnitude`) and constellation(`constellation`), here is an example using `curl`:

```
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json; charset=utf-8' -d $'{ "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "star": { "dec": "-26° 29'\'' 24.9", "ra": "16h 29m 1.0s", "story": "Found star using https://www.google.com/sky/"}}'
```

This is a sample response:

```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```

## Testing Blockchain (simpleChain.js)

To test code:
1: Open a command prompt or shell terminal after install node.js.
2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
```
3: Copy and paste your code into your node session
4: Instantiate blockchain with blockchain variable
```
let blockchain = new Blockchain();
```
5: Generate 10 blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock("test data "+i);
}
```
6: Validate blockchain
```
blockchain.validateChain();
```
7: Induce errors by changing block data
```
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}
```
8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
blockchain.validateChain();
```
