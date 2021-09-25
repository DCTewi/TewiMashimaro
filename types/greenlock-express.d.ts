import { Express } from "express"

declare module "greenlock-express" {
    interface GreenlockServer {
        serve(app: Express)
    }

    interface GreenlockFactory {
        init(params: any): GreenlockServer
    }

    const greenlock: GreenlockFactory

    export = greenlock
}

// why doesn't work
