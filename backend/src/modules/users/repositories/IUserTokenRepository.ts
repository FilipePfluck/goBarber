import UserToken from '../infra/typeorm/entities/userToken'
import User from '../infra/typeorm/entities/user'

export default interface IUserTokenRepository{
    generate(user_id: string):Promise<UserToken>
    findByToken(token: string): Promise<UserToken | undefined>
}