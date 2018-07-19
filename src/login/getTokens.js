const fetch = require('isomorphic-fetch')
const platformConfig = require('../config')

const getTokens = async (code) => {
  const body = JSON.stringify({
    code,
    redirect_uri: 'http://localhost:8000/'
  })
  const response = await fetch(`${platformConfig.backendUrl}tokens`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text)
  }
  return response.json()
}

module.exports = getTokens
