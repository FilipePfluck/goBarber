import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

import User from '../infra/typeorm/entities/user'

interface IRequest {
    user_id: string,
    avatarFilename: string
}

@injectable()
export default class UpdateUserAvatar {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider
    ){}

    public async execute({ user_id, avatarFilename }: IRequest):Promise<User>{

        const user = await this.usersRepository.findById(user_id)

        if(!user){
            throw new AppError('Not authenticated', 401)
        }

        if(user.avatar){
            await this.storageProvider.deleteFile(user.avatar)
        }

        const filename = await this.storageProvider.saveFile(avatarFilename)

        user.avatar = filename
        await this.usersRepository.save(user)

        return user
    }
}