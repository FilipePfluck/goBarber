import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import User from '../infra/typeorm/entities/user'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequest { 
    name: string
    email: string
    password: string
}

@injectable()
export default class CreateUser {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        
        @inject('HashProvider')
        private hashProvider: IHashProvider
    ){}

    public async execute({ name, email, password }: IRequest): Promise<User>{

        const checkIfUserExists = await this.usersRepository.findByEmail(email)

        if(checkIfUserExists){
            throw new AppError('Email already used.')
        }

        const hashedPassword = await this.hashProvider.generateHash(password)

        console.log('ok')

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        })

        console.log(user)

        await this.usersRepository.save(user)

        return user
    }
}