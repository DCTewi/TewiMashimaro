import { Router } from "express";

export const adminRouter = Router()

adminRouter.get('/', (req, res) => {
    res.send('admin')
})