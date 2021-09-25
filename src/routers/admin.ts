import { Router } from "express";
import { config } from "../utils/configuration";
import { db } from "../utils/database";

export const adminRouter = Router()

adminRouter.get('', async (req, res) => {
    const userKey = req.query.key as string | undefined

    if (userKey != undefined && userKey.trim() == config().adminKey) {
        let pageNumber = req.query.page as number | undefined
        if (pageNumber == undefined || pageNumber < 1) {
            pageNumber = 1
        }

        const mashimaros = await db().get()
        const capacity = 5
        const startCount = capacity * (pageNumber - 1)
        const endCount = startCount + capacity

        res.render('admin', {
            siteName: config().siteName,
            title: 'Dashboard',

            mashimaros: mashimaros.slice(startCount, endCount),

            pageNumber: pageNumber,
            pageTotal: Math.max(Math.ceil(mashimaros.length / capacity), 1),
            userKey: userKey
        })
    } else {
        res.redirect('/')
    }
})
