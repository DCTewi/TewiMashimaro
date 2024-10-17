import { Router } from "express";
import path from "path";
import { config } from "../utils/configuration";
import { db, Mashimaro } from "../utils/database";
import MarkdownIt from "markdown-it";

const md = MarkdownIt()

export const homeRouter = Router()

enum MashimaroStatus {
    Success = 0,
    Limited = 1,
    Invalid = 2,
    Unexcepted = 3,
}

let nextMashimaroTime = new Date(new Date().getTime() - 60000 / config().frequencyLimitPerMinute)

homeRouter.get('', async (req, res) => {
    let mashimaroStatus = req.query.status as MashimaroStatus | undefined

    let pageNumber = req.query.page as number | undefined
    if (pageNumber == undefined || pageNumber < 1) {
        pageNumber = 1
    }
    const capacity = config().pageCapacity
    const startCount = capacity * (pageNumber - 1)
    const endCount = startCount + capacity
    const answeredMashimaros = (await db().get()).filter(m => m.answer != undefined).sort((a, b): number => {
        if (a.read != b.read) {
            return a.read ? 1 : -1
        }

        return new Date(a.time).getTime() - new Date(b.time).getTime()
    })

    res.render(path.resolve(__dirname, '../../views/home.pug'), {
        siteName: config().siteName,
        title: config().siteName,
        description: config().description,
        headerImage: config().headerImageUrl,

        csrfToken: req.csrfToken(),
        answeredMashimaros: answeredMashimaros.slice(startCount, endCount),

        mashimaroStatus: mashimaroStatus,

        pageNumber: pageNumber,
        pageTotal: Math.max(Math.ceil(answeredMashimaros.length / capacity), 1),

        localizer: req.localizer,
        backgroundCss: `.background-container{background-image: url(${config().backgroundImageUrl});background-attachment:fixed;}`,
        md: md,
    })
})

homeRouter.post('', (req, res) => {
    let status = MashimaroStatus.Invalid

    if (config().frequencyLimitPerMinute >= 0 && nextMashimaroTime > new Date()) {
        status = MashimaroStatus.Limited
    } else {
        const author = req.body.author as string | undefined
        const content = req.body.content as string | undefined

        if (author != undefined && content != undefined) {
            db().add(new Mashimaro(author, content))
            status = MashimaroStatus.Success
            nextMashimaroTime = new Date(new Date().getTime() + 60000 / config().frequencyLimitPerMinute)
        } else {
            status = MashimaroStatus.Unexcepted
        }
    }

    res.redirect(`?status=${status.toString()}`)
})
