import cookieParser from "cookie-parser"
import csurf from "csurf"
import express from "express"
import fs from "fs"
import http from "http"
import https from "https"
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

export interface ServerArgs {
    dir: string,
    recordLog: boolean,
    enableSSL: boolean,
    crt: string,
    key: string,
    ca: string,
}

export const server = {
    deploy: (arg: ServerArgs) => {
        setRootPath(arg.dir)
        /* ensure exists */ {
            db().get()
            config()
        }

        const app: express.Express = express()

        app.set('view engine', 'pug')

        app.use(express.static(path.resolve(__dirname, _staticDir)))

        if (arg.recordLog) {
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
        app.use(csurf({ cookie: { httpOnly: true, secure: arg.enableSSL } }))

        app.use('', homeRouter)
        app.use('/me', adminRouter)


        if (arg.enableSSL) {
            https
                .createServer({
                    ca: fs.readFileSync(arg.ca, 'utf-8'),
                    key: fs.readFileSync(arg.key, 'utf-8'),
                    cert: fs.readFileSync(arg.crt, 'utf-8'),
                }, app)
                .listen(443)

            http
                .createServer((req, res) => {
                    res.writeHead(301, {
                        Location: `https://${req.headers.host}${req.url}`
                    })
                    res.end()
                })
                .listen(80)


            console.log(`Mashimaro start on port 443`)
        } else {
            app.listen(80, () => {
                console.log(`Mashimaro start on port 80`)
            })
        }
    }
}
