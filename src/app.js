import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))

import premiumRouter from './Router/premium.routes.js'

app.use("/api/v1/premium",premiumRouter)

export { app }