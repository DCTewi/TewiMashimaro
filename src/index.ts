import cookieParser from "cookie-parser"
import csurf from "csurf"
import express from "express"
import morgan from "morgan"
import { createStream } from "rotating-file-stream"
import { adminRouter } from "./routers/admin"
import { homeRouter } from "./routers/home"
import { db } from "./utils/database"

async function main(): Promise<void> {
    // let mashimaros = await db().get()
    // for (let mashimaro of mashimaros) {
    //     mashimaro.answer = "啊对对对，你说得对"
    //     await db().update(mashimaro)
    // }
    // return
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
    app.use(express.urlencoded({ extended: true }))
    app.use(csurf({ cookie: true }))

    app.use('', homeRouter)
    app.use('/me', adminRouter)

    app.listen(listenPort, () => {
        console.log(`TewiMashimaro started on port ${listenPort}.\n`)
    })
}

main()
