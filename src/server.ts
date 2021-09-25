import cookieParser from "cookie-parser"
import csurf from "csurf"
import express from "express"
import morgan from "morgan"
import { createStream } from "rotating-file-stream"
import { localizer } from "./middlewares/localizer"
import { adminRouter } from "./routers/admin"
import { homeRouter } from "./routers/home"
import { config } from "./utils/configuration"

export const _logName = 'access.log'
export const _logPath = './_log'
export const _logToken = 'Req: :remote-addr [:date[iso]] ":method :url HTTP/:http-version" :status\nAgent: ":user-agent"\n'
export const _staticDir = './public'
export const _greenlockConfPath = './_greenlock'
export const _greenlockPackageAgent = `${process.env.npm_package_name}/${process.env.npm_package_version}`

export async function main(debuged: boolean = false): Promise<void> {
    const logstream = createStream(_logName, {
        interval: '1d',
        path: _logPath,
        encoding: 'utf-8',
        teeToStdout: true
    })

    const app: express.Express = express()

    app.set('view engine', 'pug')
    
    app.use(express.static(_staticDir))
    app.use(morgan(_logToken, { stream: logstream }))
    app.use(cookieParser())
    app.use(localizer)
    app.use(express.urlencoded({ extended: true }))
    app.use(csurf({ cookie: { httpOnly: true, secure: true } }))

    app.use('', homeRouter)
    app.use('/me', adminRouter)

    if (!debuged) {
        require("greenlock-express").init({
            packageRoot: process.cwd(),
            packageAgent: _greenlockPackageAgent,
            configDir: _greenlockConfPath,

            maintainerEmail: config().maintainerEmail,

            notify: (ev: any, args: any) => {
                console.info(ev, args)
            },

            cluster: false
        }).serve(app)
    } else {
        app.listen(23456, () => {
            console.log('Mashimaro debug mode start on port 23456')
        })
    }
}
