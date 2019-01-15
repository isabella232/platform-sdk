const fetch = require('isomorphic-fetch')
const platformConfig = require('../config')
const utils = require('../utils')
const currentVersion = require('../../package.json').version

/*
 * Create Access Key For Tenant
 */

const createAccessKeyForTenant = async (tenant, title) => {
  const user = utils.getLoggedInUser()

  const response = await fetch(`${platformConfig.backendUrl}tenants/${tenant}/accessKeys`, {
    method: 'POST',
    body: JSON.stringify({
      tenantName: tenant,
      userName: user.username,
      title: title || 'serverless_' + Math.round(+new Date() / 1000)
    }),
    headers: {
      'Content-Type': 'application/json',
      'x-platform-version': currentVersion,
      Authorization: `bearer ${user.idToken}`
    }
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text)
  }

  const data = await response.json()
  return data.secretAccessKey
}

/*
 * Get Access Key For Tenant
 * - Fetches the access key for the specified `tenant`
 * - If an access key is present as an env var, that overrides all else
 */

const getAccessKeyForTenant = (tenant) => {
  // Check if in ENV, return that first...
  if (process.env.SERVERLESS_ACCESS_KEY) {
    return process.env.SERVERLESS_ACCESS_KEY
  }

  if (!tenant) {
    throw new Error('SDK: getAccessKeyForTenant() requires a "tenant".')
  }

  const user = utils.getLoggedInUser()

  // Check if in config file, return that next...
  if (!user.accessKeys || !user.accessKeys[tenant]) {
    throw new Error(`Could not find an access key for tenant ${tenant}.  Log out and log in again to create a new access key for this tenant.`) // eslint-disable-line
  }

  return user.accessKeys[tenant]
}

export { createAccessKeyForTenant, getAccessKeyForTenant }