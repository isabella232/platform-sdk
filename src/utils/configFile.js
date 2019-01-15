import fs from 'fs'
import os from 'os'
import path from 'path'
import { path as get, mergeDeepRight } from 'ramda'
import writeFileAtomic from 'write-file-atomic'

// Locate the correct .serverlessrc per current environment
let fileName = 'serverless'
if (process.env.SERVERLESS_PLATFORM_STAGE && process.env.SERVERLESS_PLATFORM_STAGE !== 'prod') {
  fileName = 'serverlessdev'
}

/*
 * Get Config File Path
 * - .serverlessrc can either be in the current working dir or system root dir.
 * - This function returns the local path first, if it exists.
 */

export const getConfigFilePath = () => {
  const localPath = path.join(process.cwd(), `.${fileName}rc`)
  const globalPath = path.join(os.homedir(), `.${fileName}rc`)
  const localConfigExists = fs.existsSync(localPath)
  const globalConfigExists = fs.existsSync(globalPath)

  if (localConfigExists) {
    return localPath
  } else if (globalConfigExists) {
    return globalPath
  }
  return null
}

/*
 * Read Config File
 * - The Framework always creates a config file on post-install via the logstat method.  (This isn't optimal and should be changed in the Framework.)
 * - The "rc" package automatically looks in many places (local folder, up a few levels, root dir)
 */

export const readConfigFile = () => {
  const configFilePath = getConfigFilePath()
  const configFile = configFilePath ? fs.readFileSync(configFilePath) : null
  return configFile ? JSON.parse(configFile) : null
}

/*
 * Write Config File
 * - Writes a .serverlessrc file on the local machine in the root dir.
 */

export const writeConfigFile = (data) => {
  const configFilePath = getConfigFilePath()
  const configFile = readConfigFile()
  const updatedConfigFile = mergeDeepRight(configFile, data)
  updatedConfigFile.meta.updated_at = Math.round(+new Date() / 1000)
  writeFileAtomic.sync(configFilePath, JSON.stringify(updatedConfigFile, null, 2))
  return updatedConfigFile
}

/*
 * Get Logged In User
 * - Fetches the current logged in user from the .serverlessrc file
 */

export const getLoggedInUser = () => {
  const config = readConfigFile()
  const user = get(['users', config.userId, 'dashboard'], config)
  if (!user || !user.username || !user.idToken) {
    return null // user is logged out
  }
  return {
    userId: config.userId,
    username: user.username,
    accessKeys: user.accessKeys,
    idToken: user.idToken
  }
}
