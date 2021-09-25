import cookieParser from "cookie-parser"
import csurf from "csurf"
import express from "express"
import morgan from "morgan"
import { createStream } from "rotating-file-stream"
import { localizer } from "./middlewares/localizer"
import { adminRouter } from "./routers/admin"
import { homeRouter } from "./routers/home"

async function main(): Promise<void> {
    const listenPort: number = 3000
    const logstream = createStream('access.log', {
        interval: '1d',
        path: '_log',
        encoding: 'utf-8',
        teeToStdout: true
    })

    const logtoken = 'Req: :remote-addr [:date[iso]] ":method :url HTTP/:http-version" :status\nAgent: ":user-agent"\n'

    const app: express.Express = express()

    app.set('view engine', 'pug')

    app.use(express.static('public'))

    app.use(morgan(logtoken, { stream: logstream }))

    app.use(cookieParser())
    app.use(localizer)
    app.use(express.urlencoded({ extended: true }))
    app.use(csurf({ cookie: { httpOnly: true, secure: true } }))

    app.use('', homeRouter)
    app.use('/me', adminRouter)

    app.listen(listenPort, () => {
        console.log(`TewiMashimaro started on port ${listenPort}.\n`)
    })
}

main()
