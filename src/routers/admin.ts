import { Router } from "express";
import { config } from "../utils/configuration";

export const adminRouter = Router()

adminRouter.get('', (req, res) => {
    const userKey = req.query.key as string | undefined

    if (userKey != undefined && userKey.trim() == config().adminKey) {
        // valid
        res.send('hello admin')
    } else {
        res.redirect('/')
    }
})
