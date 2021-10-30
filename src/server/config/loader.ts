// Native
import fs from 'fs'
// Packages
import clone from 'clone'
import convict from 'convict'

const CONVICT_LOG_LEVEL = {
    doc: 'The lowest level of output to log. "trace" is the most, "error" is the least.',
    format (val: string) {
        return ['trace', 'debug', 'info', 'warn', 'error'].includes(val)
    },
    default: 'info'
}

export default function (serverCfgPath: string) {
    const convictSchema = {
        host: {
            doc: `The IP address or hostname that ${process.title} should bind to.`,
            format: String,
            default: '0.0.0.0'
        },
        port: {
            doc: `The port that ${process.title} should listen on.`,
            format: 'port',
            default: 5050
        },
        baseURL: {
            doc: 'The URL of this instance. Used for things like cookies. Defaults to HOST:PORT. ' +
        'If you use a reverse proxy, you\'ll likely need to set this value.',
            format: String,
            default: ''
        },
        logging: {
            console: {
                enabled: {
                    doc: 'Whether to enable console logging.',
                    format: Boolean,
                    default: true
                },
                level: CONVICT_LOG_LEVEL
            },
            file: {
                enabled: {
                    doc: 'Whether to enable file logging.',
                    format: Boolean,
                    default: false
                },
                level: CONVICT_LOG_LEVEL,
                path: {
                    doc: 'The filepath to log to.',
                    type: String,
                    default: `logs/${process.title}.log`
                }
            }
        }
    }

    const convictConfig = convict(convictSchema)

    // Load server config if it exists, and merge it
    const serverCfgExists = fs.existsSync(serverCfgPath)
    if (serverCfgExists) {
        convictConfig.loadFile(serverCfgPath)
    } else {
        console.info(`${process.title}] No config found, using defaults.`)
    }

    convictConfig.validate()
    const config = convictConfig.getProperties()

    config.baseURL = config.baseURL || `${config.host === '0.0.0.0' ? 'localhost' : config.host}:${config.port}`

    return clone(config)
}
