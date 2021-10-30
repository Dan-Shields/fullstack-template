import winston from 'winston'
const { format } = winston

export interface ILogger {
    trace (...args: any): void;
    debug (...args: any): void;
    info (...args: any): void;
    warn (...args: any): void;
    error (...args: any): void;
}

/**
 * Enum logging level values.
 * @enum {String}
 */
const ENUM_LEVELS = {// eslint-disable-line no-unused-vars
    trace: 'The highest level of logging, logs everything.',
    debug: 'Less spammy than trace, includes most info relevant for debugging.',
    info: 'The default logging level. Logs useful info, warnings, and errors.',
    warn: 'Only logs warnings and errors.',
    error: 'Only logs errors.'
}

/**
 * A factory that configures and returns a Logger constructor.
 * @param [initialOpts] {Object} - Configuration for the logger.
 *
 * @param [initialOpts.console] {Object} - Configuration for the console logging.
 * @param [initialOpts.console.enabled=false] {Boolean} - Whether to enable console logging.
 * @param [initialOpts.console.level="info"] {ENUM_LEVELS} - The level of logging to output to the console.
 *
 * @param [initialOpts.file] {Object} - Configuration for file logging.
 * @param initialOpts.file.path {String} - Where the log file should be saved.
 * @param [initialOpts.file.enabled=false] {Boolean} - Whether to enable file logging.
 * @param [initialOpts.file.level="info"] {ENUM_LEVELS} - The level of logging to output to file.
 *
 * @param [initialOpts.replicants=false] {Boolean} - Whether to enable logging specifically for the Replicants system.
 *
 * @returns {function} - A constructor used to create discrete logger instances.
 */
export default function (initialOpts: any) {
    initialOpts = initialOpts || {}
    initialOpts.console = initialOpts.console || { enabled: true }
    initialOpts.file = initialOpts.file || {}
    initialOpts.file.path = initialOpts.file.path || 'logs/out.log'

    const {
        colorize,
        combine,
        timestamp,
        errors,
        printf,
        splat,
    } = winston.format
  
    const devFormat = combine(
        format((info) => {
            info.level = info.level.toUpperCase()
            return info
        })(),
        colorize(),
        timestamp(),
        splat(),
        errors(),
        printf(
            ({
                timestamp,
                level,
                message,
                ...rest
            }) => {
                let restString = JSON.stringify(rest, undefined, 2)
                restString = restString === '{}' ? '' : restString

                return `[${timestamp}] ${level} - ${message} ${restString}`
            },
        ),
    )

    const consoleTransport = new winston.transports.Console({ 
        format: devFormat,

        level: initialOpts.console.level || 'info',
        silent: !initialOpts.console.enabled,
        stderrLevels: ['warn', 'error']
    })

    const fileTransport = new winston.transports.File({
        format: devFormat,

        filename: initialOpts.file.path,
        level: initialOpts.file.level || 'info',
        silent: !initialOpts.file.enabled
    })

    winston.addColors({
        trace: 'green',
        debug: 'cyan',
        info: 'white',
        warn: 'yellow',
        error: 'red'
    })

    interface customLogger extends winston.Logger {
        trace(message: string, ...meta: any[]): winston.Logger;
    }

    const mainLogger: customLogger = winston.createLogger({
        transports: [consoleTransport, fileTransport],
        levels: {
            trace: 4,
            debug: 3,
            info: 2,
            warn: 1,
            error: 0
        }
    }) as customLogger

    /**
  * Constructs a new Logger instance that prefixes all output with the given name.
  * @param name {String} - The label to prefix all output of this logger with.
  * @returns {Object} - A Logger instance.
  * @constructor
  */
    class Logger implements ILogger {
        private name: string
  
        constructor (name: string) {
            this.name = name
        }

        trace (...args: any) {
            mainLogger.trace(`[${this.name}] ${args[0]}`, ...args.slice(1))
        }
  
        debug (...args: any) {
            mainLogger.debug(`[${this.name}] ${args[0]}`, ...args.slice(1))
        }
  
        info (...args: any) {
            mainLogger.info(`[${this.name}] ${args[0]}`, ...args.slice(1))
        }
  
        warn (...args: any) {
            mainLogger.warn(`[${this.name}] ${args[0]}`, ...args.slice(1))
        }
  
        error (...args: any) {
            mainLogger.error(`[${this.name}] ${args[0]}`, ...args.slice(1))
        }
    }

    _configure(initialOpts)

    function _configure (opts: any) {
    // Initialize opts with empty objects, if nothing was provided.
        opts = opts || {}
        opts.console = opts.console || {}
        opts.file = opts.file || {}

        if (typeof opts.console.enabled !== 'undefined') {
            consoleTransport.silent = !opts.console.enabled
        }

        if (typeof opts.console.level !== 'undefined') {
            consoleTransport.level = opts.console.level
        }

        if (typeof opts.file.enabled !== 'undefined') {
            fileTransport.silent = !opts.file.enabled
        }

        if (typeof opts.file.level !== 'undefined') {
            fileTransport.level = opts.file.level
        }

        if (typeof opts.file.path !== 'undefined') {
            fileTransport.filename = opts.file.path
        }
    }

    return Logger
}
