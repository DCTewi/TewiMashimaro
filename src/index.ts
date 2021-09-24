import cookieParser from "cookie-parser"
import csurf from "csurf"
import express from "express"
import { adminRouter } from "./routers/admin"
import { homeRouter } from "./routers/home"
import { db } from "./utils/database"

const listenPort: number = 3000

async function main(): Promise<void> {
    // let mashimaros = await db().get()
    // for (let mashimaro of mashimaros) {
    //     mashimaro.answer = "啊对对对，你说得对"
    //     await db().update(mashimaro)
    // }
    // return

    const app: express.Express = express()
    app.set('view engine', 'pug')

    app.use(express.static('public'))
    app.use(cookieParser())
    app.use(express.urlencoded({ extended: true }))
    app.use(csurf({ cookie: true }))

    app.use('', homeRouter)
    app.use('/me', adminRouter)
    
    app.listen(listenPort, () => {
        console.log(`Start on port ${listenPort}.`)
    })
}

main()
