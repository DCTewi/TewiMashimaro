import fs from "fs"
import { v4 } from "uuid"
import { resolvedPath } from "./pathresolver"

class Configuration {
    siteName: string
    description: string
    headerImageUrl: string
    backgroundImageUrl: string
    frequencyLimitPerMinute: number
    pageCapacity: number
    adminCapacity: number
    adminKey: string

    constructor() {
        this.siteName = "Tewi Mashimaro"
        this.description = "通过棉花糖来向我匿名提问!"
        this.headerImageUrl = ''
        this.backgroundImageUrl = ''
        this.frequencyLimitPerMinute = 6
        this.pageCapacity = 5
        this.adminCapacity = 10
        this.adminKey = v4()
    }
}

const configurationPath = "./config.json"

export const config = (): Configuration => {
    try {
        const raw = fs.readFileSync(resolvedPath(configurationPath), 'utf-8')
        let conf = JSON.parse(raw) as Configuration
        return conf
    } catch {
        fs.writeFileSync(resolvedPath(configurationPath), JSON.stringify(new Configuration(), null, 4), 'utf-8')
        return new Configuration()
    }
}

export const setConfig = (config: Configuration) => {
    fs.writeFileSync(resolvedPath(configurationPath), JSON.stringify(config, null, 4), 'utf-8')
}
