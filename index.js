var nacl = require('tweetnacl')

module.exports = {
  encryptRequest: encryptRequest,
  decryptRequest: decryptRequest
}

// Sign and encrypt the request payload with the given key pair
// payload -> (payload, signature) = message -> (message, nonce)
function encryptRequest (payload, keyPair) {
  // Sign the given payload and put it into a message object
  payload = JSON.stringify(payload)
  var userSecret = nacl.util.decodeBase64(keyPair.secretKey)
  var userPublic = nacl.util.decodeBase64(keyPair.publicKey)
  var signature = nacl.sign.detached(nacl.util.decodeUTF8(payload), userSecret)
  var message = {
    payload: payload,
    signature: nacl.util.encodeBase64(signature)
  }

  // Encrypt the message with the secretKey given a random nonce
  message = JSON.stringify(message)
  var nonce = nacl.randomBytes(24)
  var encryptedMessage = nacl.secretbox(nacl.util.decodeUTF8(message), nonce, userPublic)

  // Generate the request and give it back
  return {
    message: nacl.util.encodeBase64(encryptedMessage),
    nonce: nacl.util.encodeBase64(nonce)
  }
}

// Get the decrypted and signature verified payload of a request object
// (message, nonce) -> message = (payload, signature) -> payload
function decryptRequest (requestBody, keyPair) {
  var message = requestBody.message
  var nonce = requestBody.nonce

  // Missing request parameters
  if (!message || !nonce) {
    return false
  }

  // Grab the user's key pair and decrypt the secretbox message
  message = nacl.util.decodeBase64(message)
  nonce = nacl.util.decodeBase64(nonce)
  var userPublic = nacl.util.decodeBase64(keyPair.publicKey)
  var decryptedMessage = nacl.secretbox.open(message, nonce, userPublic)
  if (!decryptedMessage) {
    return false
  }
  decryptedMessage = nacl.util.encodeUTF8(decryptedMessage)

  // Parse the message and check if it consists of the required parameters
  decryptedMessage = JSON.parse(decryptedMessage)
  var payload = decryptedMessage.payload
  var signature = decryptedMessage.signature
  if (!payload || !signature) {
    return false
  }

  // Check if the signature is valid
  signature = nacl.util.decodeBase64(signature)
  var valid = nacl.sign.detached.verify(nacl.util.decodeUTF8(payload), signature, userPublic)
  if (!valid) {
    return false
  }

  // All checks passed, let's return the parsed decrypted payload
  return JSON.parse(payload)
}
