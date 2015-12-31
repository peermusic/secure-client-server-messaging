var messaging = require('./index.js')
var nacl = require('tweetnacl')
var assert = require('assert')

// Check that the module works if we have the same keys
function checkMatchingKeypair () {
  var payload = {title: 'Set fire to the rain', artist: 'Adele'}
  var keys = nacl.sign.keyPair()
  var request = messaging.encryptRequest(payload, keys)
  var decryptedPayload = messaging.decryptRequest(request, keys)
  assert.deepEqual(decryptedPayload, payload)
}

// Check that the module works if we have different keys
function checkFailingKeypairs () {
  var payload = {title: 'Set fire to the rain', artist: 'Adele'}
  var keys = nacl.sign.keyPair()
  var request = messaging.encryptRequest(payload, keys)
  keys = nacl.sign.keyPair()
  var decryptedPayload = messaging.decryptRequest(request, keys)
  assert.notDeepEqual(decryptedPayload, payload)
  assert.equal(decryptedPayload, false)
}

// Run all tests
checkMatchingKeypair()
checkFailingKeypairs()
console.log('All tests passed.')
