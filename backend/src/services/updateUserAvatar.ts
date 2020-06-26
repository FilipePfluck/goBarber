import { getRepository } from 'typeorm'
import path from 'path'
import fs from 'fs'

import AppError from '../errors/AppError'

import uploadConfig from '../config/upload'

import User from '../models/user'

interface Request {
    user_id: string,
    avatarFilename: string
}

export default class UpdateUserAvatar {
    public async execute({ user_id, avatarFilename }: Request):Promise<User>{
        const usersRepository = getRepository(User)

        const user = await usersRepository.findOne(user_id)

        if(!user){
            throw new AppError('Not authenticated', 401)
        }

        if(user.avatar){
            const userAvatarFilePath =  path.join(uploadConfig.directory, user.avatar)
            const userAvatarExists = await fs.promises.stat(userAvatarFilePath)

            if(userAvatarExists){
                await fs.promises.unlink(userAvatarFilePath)
            }
            
        }

        user.avatar = avatarFilename

        await usersRepository.save(user)

        return user
    }
}