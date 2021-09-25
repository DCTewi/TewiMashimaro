import { Router } from "express";
import { config } from "../utils/configuration";
import chalk from "chalk"

export const adminRouter = Router()

adminRouter.get('', (req, res) => {
    console.log(`[GET] ${chalk.green(req.url)} from ${chalk.yellow(req.ip)}`)

    const userKey = req.query.key as string | undefined

    if (userKey != undefined && userKey.trim() == config().adminKey) {
        // valid
        res.send('hello admin')
    } else {
        res.redirect('/')
    }
})
