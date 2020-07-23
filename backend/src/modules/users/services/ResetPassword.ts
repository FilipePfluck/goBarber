import { injectable, inject } from 'tsyringe'
import { isAfter, addHours } from 'date-fns'

import IUsersRepository from '../repositories/IUsersRepository'
import IUserTokenRepository from '../repositories/IUserTokenRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

import AppError from '@shared/errors/AppError'
import User from '../infra/typeorm/entities/user'
import { id } from 'date-fns/locale'

interface IRequest {
    password:string
    token: string
}

@injectable()
export default class ResetPassword {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokenRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ){}

    public async execute( {token, password}: IRequest ):Promise<void>{

        console.log('ok')

        const userToken = await this.userTokensRepository.findByToken(token)

        console.log('userToken: ',userToken)

        if(!userToken){
            throw new AppError("User token doesn't exists")
        }

        const user = await this.usersRepository.findById(userToken.user_id)

        if(!user){
            throw new AppError("User doesn't exists")
        }

        console.log('user:', user)

        const tokenCreatedAt = userToken.created_at

        const compareDate = addHours(tokenCreatedAt, 2)

        if(isAfter(Date.now(), compareDate)){
            throw new AppError('token expired')
        }

        user.password = await this.hashProvider.generateHash(password)

        await this.usersRepository.save(user)
    }
}