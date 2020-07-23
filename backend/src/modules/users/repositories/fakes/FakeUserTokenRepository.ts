import { uuid }  from 'uuidv4'

import IuserTokenRepository from '@modules/users/repositories/IUserTokenRepository'

import UserToken from '../../infra/typeorm/entities/userToken'
import User from '@modules/users/infra/typeorm/entities/user'

class FakeUserTokenRepository 
    implements IuserTokenRepository{
        private userTokens: UserToken[] = []

        public async generate(user_id: string): Promise<UserToken> {
            const userToken = new UserToken()

            Object.assign(userToken, {
                id: uuid(),
                token: uuid(),
                user_id,
                created_at: new Date(),
                updated_at: new Date()
            })

            this.userTokens.push(userToken)

            return userToken
        }

        public async findByToken(token: string): Promise<UserToken | undefined> {
            const userToken = this.userTokens.find(findToken => findToken.token === token)
            
            //esse userToken contém o id do usuário (userToken.id)
            return userToken
        }
    }

export default FakeUserTokenRepository