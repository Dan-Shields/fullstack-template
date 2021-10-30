// Native
import fs from 'fs-extra'
import path from 'path'

import loadConfig from './loader'

const serverCfgFilePath = path.join(process.env.ROOT || '.', 'config/server.json')
const cfgDirectoryPath = path.parse(serverCfgFilePath).dir

// Make 'config' folder if it doesn't exist
if (!fs.existsSync(cfgDirectoryPath)) {
    fs.mkdirpSync(cfgDirectoryPath)
}

export const config = loadConfig(serverCfgFilePath)
