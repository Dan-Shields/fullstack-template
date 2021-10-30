// Packages
import express from 'express'
import { body, validationResult } from 'express-validator'

// Ours

import { Logger } from '../logger'

const log = new Logger('FCG-Controller/server/api')

export default function () {

    const app = express()

    // Add API routes here

    /* E.g.:
    app.post('/exec-cue',
        [
            body('tag').exists().isNumeric(),
            body('action').exists().isIn(['take', 'lose'])
        ],
        async (req: express.Request, res: express.Response) => {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { tag, action } = req.body

            const cue = await Cue.findOne({
                tag
            })

            if (!cue) {
                return res.status(404).json({ errors: ['cue not found']})
            }

            log.debug('Received exec-cue POST request')

            await executeCue(cue.id, action)

            return res.status(200).send()
        }
    )*/

    return app
}
