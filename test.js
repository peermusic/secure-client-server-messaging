var messaging = require('./index.js')
var nacl = require('tweetnacl')
var assert = require('assert')

// Check that the module works if we have the same keys
function checkMatchingKeypair () {
  var payload = {title: 'Set fire to the rain', artist: 'Adele'}
  var keys = nacl.sign.keyPair()
  var request = messaging.encrypt(payload, keys.publicKey)
  var decryptedPayload = messaging.decrypt(request, keys.publicKey)
  assert.deepEqual(decryptedPayload, payload)
}

// Check that the module works if we have different keys
function checkFailingKeypairs () {
  var payload = {title: 'Set fire to the rain', artist: 'Adele'}
  var keys = nacl.sign.keyPair()
  var request = messaging.encrypt(payload, keys.publicKey)
  keys = nacl.sign.keyPair()
  var decryptedPayload = messaging.decrypt(request, keys.publicKey)
  assert.notDeepEqual(decryptedPayload, payload)
  assert.equal(decryptedPayload, false)
}

// Run all tests
checkMatchingKeypair()
checkFailingKeypairs()
console.log('All tests passed.')
