import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import {sign} from 'jsonwebtoken'

import AppError from '../errors/AppError'
import authConfig from '../config/auth'
import User from '../models/user'

interface Request {
    email: string
    password: string
}

interface Response {
    user: User
    token: string
}

export default class AuthenticateUser {
    public async execute({ email, password}: Request):Promise<Response>{
        const usersRepository = getRepository(User)

        const user = await usersRepository.findOne({
            where: {email}
        })

        console.log('incorrect email/password')
        if(!user){
            throw new AppError('Incorrect email/password combination', 401)
            
        }

        const matchedPassword = await compare(password, user.password)

        if(!matchedPassword){
            throw new AppError('Incorrect email/password combination', 401)
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn
        })

        return { user, token }
    }
}