import { Repository, getRepository, Not } from 'typeorm'

import IusersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateuserDTO from '@modules/users/dtos/ICreateUserDTO'
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO'

import user from '../entities/user'

class UsersRepository 
    implements IusersRepository{
    
        private ormRepository: Repository<user>

        constructor(){
            this.ormRepository = getRepository(user)
        }

        public async findById(Id: string): Promise<user | undefined> {

            const finduser = await this.ormRepository.findOne(Id)

            return finduser
        }

        public async findByEmail(email: string): Promise<user | undefined> {

            const finduser = await this.ormRepository.findOne({
                where: {email}
            })

            return finduser
        }

        public async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<user[]> {
            let users: user[]
            
            if (except_user_id){
                users = await this.ormRepository.find({
                    where: {
                        id: Not(except_user_id)
                    }
                })
            }else{
                users = await this.ormRepository.find()
            }

            return users
        }

        public async create({ name, email, password }: ICreateuserDTO): Promise<user>{
            const user = this.ormRepository.create({ name, email, password })

            console.log(user)

            await this.ormRepository.save(user)

            return user
        }

        public async save(user: user): Promise<user>{
            return this.ormRepository.save(user)
        }
    }

export default UsersRepository