import { config } from '../config'

import serverLogger from './server'

export const Logger = serverLogger(config.logging || {})
