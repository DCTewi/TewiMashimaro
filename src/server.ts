import cookieParser from "cookie-parser"
import csurf from "csurf"
import express from "express"
import morgan from "morgan"
import path from "path"
import { createStream } from "rotating-file-stream"
import { localizer } from "./middlewares/localizer"
import { adminRouter } from "./routers/admin"
import { homeRouter } from "./routers/home"
import { config } from "./utils/configuration"
import { db } from "./utils/database"
import { resolvedPath, setRootPath } from "./utils/pathresolver"

const _logName = 'access.log'
const _logPath = './_log'
const _logToken = 'Req: :remote-addr [:date[iso]] ":method :url HTTP/:http-version" :status\nAgent: ":user-agent"\n'
const _staticDir = '../public'

export const server = {
    deploy: (dir: string, port: number, openLog: boolean, useSSL: boolean) => {
        setRootPath(dir)
        /* ensure exists */ {
            db().get()
            config()
        }

        const app: express.Express = express()

        app.set('view engine', 'pug')

        app.use(express.static(path.resolve(__dirname, _staticDir)))

        if (openLog) {
            const logstream = createStream(_logName, {
                interval: '1d',
                path: resolvedPath(_logPath),
                encoding: 'utf-8',
                teeToStdout: true
            })
            app.use(morgan(_logToken, { stream: logstream }))
        }

        app.use(cookieParser())
        app.use(localizer)
        app.use(express.urlencoded({ extended: true }))
        app.use(csurf({ cookie: { httpOnly: true, secure: useSSL } }))

        app.use('', homeRouter)
        app.use('/me', adminRouter)

        app.listen(port, () => {
            console.log(`Mashimaro start on port ${port}`)
        })
    }
}
