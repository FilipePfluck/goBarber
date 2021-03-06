import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import AppError from '@shared/errors/AppError'

import authConfig from '@config/auth'

interface TokenPayload{
    iat: number,
    exp: number, 
    sub: string
}

export default function ensureAuthenticated(
    request: Request, response: Response, next: NextFunction
){
    const authHeader = request.headers.authorization

    if(!authHeader){
        throw new AppError('jwt token is missing', 401)
    }

    const [, token] = authHeader.split(' ')

    try{
        const encoded = verify(token, authConfig.jwt.secret)

        const {sub} = encoded as TokenPayload

        request.user = {
            id: sub
        }

        return next()
    }catch{
        throw new AppError('invalid JWT token', 401)
    }
}