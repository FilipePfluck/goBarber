import { Request, Response } from 'express'
import { parseISO } from 'date-fns'
import { container } from 'tsyringe'

import { classToClass } from 'class-transformer'

import ListProviders from '@modules/appointments/services/ListProvider'

export default class ProvidersController {
    public async index(request: Request, response: Response): Promise<Response>{
        const user_id = request.user.id

        const listProviders = container.resolve(ListProviders)

        const providers = await listProviders.execute({
            except_user_id: user_id
        })

        return response.json(classToClass(providers))
    }
}