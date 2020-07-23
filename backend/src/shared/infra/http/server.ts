import 'reflect-metadata'
import 'dotenv/config'

import cors from 'cors'
import express, {  Request, Response, NextFunction } from 'express'
import { errors } from 'celebrate'
import 'express-async-errors'

import routes from './routes/index'
import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'

import '@shared/infra/typeorm'
import '@shared/container'

const app = express()

app.use(express.json())
app.use(cors())
app.use('files', express.static(uploadConfig.uploadFolder))
app.use(routes)
app.use(errors())

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