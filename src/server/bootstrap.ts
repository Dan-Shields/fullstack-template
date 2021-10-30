process.title = 'Fullstack-Template'

import { emitter, start} from './index'

if (!process.env.ROOT) {
    process.env.ROOT = process.cwd()
}

emitter
    .on('error', () => process.exit(1))
    .on('stopped', () => process.exit(0))

start()
