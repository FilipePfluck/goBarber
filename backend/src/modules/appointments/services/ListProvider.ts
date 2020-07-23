import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

import User from '@modules/users/infra/typeorm/entities/user'

interface IRequest {
    except_user_id: string,
}

@injectable()
export default class ListProviders {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ){}

    public async execute({ except_user_id }: IRequest):Promise<User[]>{
        const user = await this.usersRepository.findAllProviders({
            except_user_id
        })

        if(!user){
            throw new AppError('User does not exists')
        }

        return user
    }
}