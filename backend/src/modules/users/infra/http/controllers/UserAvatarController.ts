import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import UpdateUserAvatar from '@modules/users/services/updateUserAvatar'

export default class UserAvatarController {
    public async update(request: Request, response: Response): Promise<Response>{
        const updateUserAvatar = container.resolve(UpdateUserAvatar)
            console.log('controller')
            const user = await updateUserAvatar.execute({
                user_id: request.user.id,
                avatarFilename: request.file.filename
            })

            delete user.password

            return response.json(classToClass(user))
    }
}