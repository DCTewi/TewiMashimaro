import { Literals } from "../../src/middlewares/localizer"

declare global {
    namespace Express {
        interface Request {
            localizer: Literals
        }
    }
}
