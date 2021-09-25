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

        const mashimaros = (await db().get()).sort((a, b): number => {
            if (a.read != b.read) {
                return a.read ? 1 : -1
            }

            return new Date(a.time).getTime() - new Date(b.time).getTime()
        })
        const capacity = config().adminCapacity
        const startCount = capacity * (pageNumber - 1)
        const endCount = startCount + capacity

        res.render('admin', {
            siteName: config().siteName,
            title: 'Dashboard',

            csrfToken: req.csrfToken(),
            mashimaros: mashimaros.slice(startCount, endCount),

            pageNumber: pageNumber,
            pageTotal: Math.max(Math.ceil(mashimaros.length / capacity), 1),
            userKey: userKey
        })
    } else {
        res.redirect('/')
    }
})

adminRouter.post('', async (req, res) => {
    const userKey = req.query.key as string | undefined

    if (userKey != undefined && userKey.trim() == config().adminKey) {
        console.log(req.body)

        const method = req.body.method as string | undefined
        const id = req.body.id as string | undefined

        if (method != undefined && id != undefined) {
            if (method == 'delete') {
                await db().remove(id)
            } else if (method == 'read') {
                let mashimaro = (await db().get()).find(m => m.id == id)
                
                if (mashimaro != undefined) {
                    mashimaro.read = !mashimaro.read
                    await db().update(mashimaro)
                }
            } else if (method == 'answer') {
                const answer = req.body.answer as string | undefined

                if (answer != undefined) {
                    let mashimaro = (await db().get()).find(m => m.id == id)
                
                    
                    console.log(method, id, answer, mashimaro)
                    if (mashimaro != undefined) {
                        mashimaro.read = true
                        mashimaro.answer = answer
                        
                        console.log(method, id, answer, mashimaro)
                        await db().update(mashimaro)
                    }
                }
            }
        }

        res.redirect(req.originalUrl)
    } else {
        res.redirect('/')
    }
})
