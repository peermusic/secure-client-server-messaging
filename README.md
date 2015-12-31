# Secure client-to-server messaging

Secure messaging between a client and a server using a **shared secret key**. This uses a 32 bit key and 
a random 20 bit nonce for encryping and signing the payload. 

Uses the [tweetnacl](https://github.com/dchest/tweetnacl-js) library.

## Install

```
npm install https://github.com/peermusic/secure-client-server-messaging
```

```js
var messaging = require('secure-client-server-messaging')
```

For reference see the [Browserify Handbook](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Usage

```js
var messaging = require('secure-client-server-messaging')

// Sign and encrypt the request payload with the given 32 bit key
var request = messaging.encrypt(payload, key);
// "request" is now an object {message: encryptedMessage, nonce: randomNonce}

// Get the decrypted and signature verified payload of a request object
var payload = messaging.decrypt(request, key);
// "payload" is now the original payload
```

## Tests

```
npm test
```

## Encryption & authentication flow

1. Generate the message to the server
3. Encrypt the message using secretbox with a random nonce and the private key and generate an object `{message: encrypted-object-a, nonce: xxx}`
4. Send this object to the server
5. The server decrypts object with the given nonce and the saved private key (this automatically verifies the signature)
7. If the decryption and the signature check are valid, the request is continued as normal
8. The server answers the same way a user would generate it's object and the user decrypts and verifies the signature before running like the server would before continuing as normal
