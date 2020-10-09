import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import CreateUser from '@modules/users/services/createUser'
import UpdateProfile from '@modules/users/services/UpdateProfile'
import ShowUser from '@modules/users/services/ShowProfile'

export default class UserssController {
    public async create(request: Request, response: Response): Promise<Response>{
        try{
            const { name, email, password } = request.body

            console.log('controller')

            const createUser = container.resolve(CreateUser)

            const user = await createUser.execute({
                name, 
                email,
                password
            })
    
            return response.json(classToClass(user))
        }catch(error){
            return response.status(400).json({error: error.message})
        }
    }

    public async update(request: Request, response: Response): Promise<Response>{
        try{
            const user_id = request.user.id
            const { name, email, password, old_password } = request.body

            const updateProfile = container.resolve(UpdateProfile)

            const user = await updateProfile.execute({
                user_id,
                name,
                email,
                password,
                old_password
            })

            return response.json(classToClass(user))
        }catch(error){
            return response.status(400).json({error: error.message})
        }
    }

    public async show(request: Request, response: Response): Promise<Response>{
        try{
            const user_id = request.user.id

            const showUser = container.resolve(ShowUser)

            const user = await showUser.execute({user_id})

            return response.json(classToClass(user))
        }catch(error){
            return response.status(400).json({error: error.message})
        }
    }
}