import express from 'express'
import ClientRoutes from './routes/ClientRoutes'

class App{
    public express: express.Application
    constructor(){
        this.express = express()
        this.middlewares()
        this.routes()
    }
    private middlewares(): void{
        this.express.use(express.json())
    }
    private routes() : void{
        this.express.use('/client', ClientRoutes)
    }
}

export default new App().express