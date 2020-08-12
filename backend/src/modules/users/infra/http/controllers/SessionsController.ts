import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import AuthenticateUser from '@modules/users/services/AuthenticateUser'

export default class SessionsController {
    public async create(request: Request, response: Response): Promise<Response>{
        const { email, password } = request.body

        console.log("ok")

        const authenticateUser = container.resolve(AuthenticateUser)

        const {user, token} = await authenticateUser.execute({
            email, 
            password
        })

        return response.json({ user: classToClass(user), token })
    }
}