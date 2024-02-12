import express from 'express'
import cors from 'cors'
import ClientRoutes from './routes/ClientRoutes'
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

class App{
    public express: express.Application
    constructor(){
        this.express = express()
        this.middlewares()
        this.routes()
    }
    private middlewares(): void{
        this.express.use(express.json())
        this.express.use(cors({
            origin: 'http://localhost:3000', 
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            optionsSuccessStatus: 204,
            allowedHeaders: 'Content-Type,Authorization'
        }))
    }
    private routes() : void{
        this.express.use('/clients', ClientRoutes)
    }
}

export default new App().express