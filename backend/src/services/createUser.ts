import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import AppError from '../errors/AppError'

import User from '../models/user'

interface Request { 
    name: string
    email: string
    password: string
}

export default class CreateUser {
    public async execute({ name, email, password }: Request): Promise<User>{
        const usersRepository = getRepository(User)

        const checkIfUserExists = await usersRepository.findOne({
            where: { email }
        })

        if(checkIfUserExists){
            throw new AppError('Email already used.')
        }

        const hashedPassword = await hash(password, 8)

        const user = await usersRepository.create({
            name,
            email,
            password: hashedPassword,
        })

        await usersRepository.save(user)

        return user
    }
}