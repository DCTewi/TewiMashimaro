import Level from "level"
import { v1 } from "uuid"

export class Mashimaro {
    id: string
    author: string
    content: string
    time: Date
    read: boolean
    answer?: string

    constructor(author: string, content: string) {
        this.id = v1()
        this.author = author
        this.content = content
        this.time = new Date()
        this.read = false
        this.answer = undefined
    }
}

class DbContext {
    private static _instance?: DbContext = undefined
    private static _mashimaros_dbkey: string = "_m"

    static instance(): DbContext {
        if (DbContext._instance == undefined) {
            DbContext._instance = new DbContext()
        }

        return DbContext._instance
    }

    private _db: Level.LevelDB<any, any>

    private constructor() {
        if (DbContext._instance != undefined) {
            throw "can't instantiate a singeleton twice"
        } else {
            DbContext._instance = this
        }

        this._db = Level('./_db', { valueEncoding: 'json' })
    }

    async get(): Promise<Mashimaro[]> {
        try {
            return await this._db.get(DbContext._mashimaros_dbkey)
        } catch (error) {
            return []
        }
    }

    async add(mashimaro: Mashimaro): Promise<void> {
        let mashimaros = await this.get() as Mashimaro[]

        mashimaros.push(mashimaro)

        await this._db.put(DbContext._mashimaros_dbkey, mashimaros)
    }

    async remove(id: string): Promise<void> {
        let mashimaros = await this.get() as Mashimaro[]

        const index = mashimaros.findIndex(m => m.id == id)

        mashimaros.splice(index, 1)

        await this._db.put(DbContext._mashimaros_dbkey, mashimaros)
    }

    async update(mashimaro: Mashimaro): Promise<void> {
        await this.remove(mashimaro.id)
        await this.add(mashimaro)
    }
}

export const db = (): DbContext => {
    return DbContext.instance()
}
