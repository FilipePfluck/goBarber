import 'reflect-metadata'

import cors from 'cors'
import express, {  Request, Response, NextFunction } from 'express'
import 'express-async-errors'

import routes from './routes/index'
import uploadConfig from './config/upload'
import AppError from './errors/AppError'

import './database/index'

const app = express()

app.use(express.json())
app.use(cors())
app.use('files', express.static(uploadConfig.directory))
app.use(routes)

app.use((err: Error, request: Request, response: Response, next: NextFunction)=>{
    if(err instanceof AppError){
        console.log(err.message)

        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message
        })
    }

    console.error(err)

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})


app.listen(3332, ()=>{
    console.log('\n server started!')
})