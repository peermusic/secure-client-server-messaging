var nacl = require('tweetnacl')

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}

// Sign and encrypt the request payload with the given key pair
function encrypt (payload, key) {
  key = nacl.util.decodeBase64(key)

  // Encrypt the message with the secretKey given a random nonce
  var message = JSON.stringify(payload)
  var nonce = nacl.randomBytes(24)
  var encryptedMessage = nacl.secretbox(nacl.util.decodeUTF8(message), nonce, key)

  // Generate the request and give it back
  return {
    message: nacl.util.encodeBase64(encryptedMessage),
    nonce: nacl.util.encodeBase64(nonce)
  }
}

// Get the decrypted and signature verified payload of a request object
function decrypt (requestBody, key) {
  key = nacl.util.decodeBase64(key)
  var message = requestBody.message
  var nonce = requestBody.nonce

  // Missing request parameters
  if (!message || !nonce) {
    return false
  }

  // Grab the user's key pair and decrypt the secretbox message
  message = nacl.util.decodeBase64(message)
  nonce = nacl.util.decodeBase64(nonce)
  var decryptedMessage = nacl.secretbox.open(message, nonce, key)
  if (!decryptedMessage) {
    return false
  }
  decryptedMessage = nacl.util.encodeUTF8(decryptedMessage)

  // All checks passed, let's return the parsed decrypted message
  return JSON.parse(decryptedMessage)
}
