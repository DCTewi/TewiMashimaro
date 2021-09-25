import fs from "fs"
import { v4 } from "uuid"

class Configuration {
    siteName: string
    description: string
    headerImageUrl?: URL
    adminKey: string
    frequencyLimitPerMinute: number
    pageCapacity: number

    constructor() {
        this.siteName = "Tewi Mashimaro"
        this.description = "通过棉花糖来向我匿名提问!"
        this.adminKey = v4()
        this.frequencyLimitPerMinute = 2
        this.pageCapacity = 5
    }
}

const configurationPath = "./config.json"

export const config = (): Configuration => {
    try {
        const raw = fs.readFileSync(configurationPath, 'utf-8')
        let conf = JSON.parse(raw) as Configuration
        return conf
    } catch {
        fs.writeFileSync(configurationPath, JSON.stringify(new Configuration(), null, 4), 'utf-8')
        return new Configuration()
    }
}

export const setConfig = (config: Configuration) => {
    fs.writeFileSync(configurationPath, JSON.stringify(config, null, 4), 'utf-8')
}
