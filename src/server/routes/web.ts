// Native
import path from 'path'
import fs from 'fs'

// Packages
import express from 'express'

// Ours
import { Logger } from '../logger'

const log = new Logger('FCG-Controller/server/web-routes')

const isDev = process.env.NODE_ENV === 'development'

export default function () {

    let assetManifest: any

    if (!isDev) {
        const assetManifestPath = path.join(process.env.ROOT || '.', 'build/client/manifest.json')

        const assetManifestExists = fs.existsSync(assetManifestPath)
        if (assetManifestExists) {  
            const assetManifestFile = fs.readFileSync(assetManifestPath)

            assetManifest = JSON.parse(assetManifestFile.toString())
        } else {
            log.error('In production but no asset manifest.json file found in /build/client')
        }
    }

    const app = express()

    // Static routes
    app.use(express.static(path.join(process.env.ROOT || '.', 'static')))

    app.set('views', path.join(process.env.CG_ROOT || '.', 'views'))
    app.set('view engine', 'ejs')

    app.get('/', async (req, res) => {
        const renderOptions: { [key: string ]: any} = { 
            isDev
        }

        if (!isDev && assetManifest) {
            renderOptions['assetManifest'] = assetManifest
        }

        res.render('index', renderOptions)
    })

    return app
}
