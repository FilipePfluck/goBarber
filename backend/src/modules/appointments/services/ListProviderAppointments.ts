import { injectable, inject } from 'tsyringe'
import { getHours, isAfter } from 'date-fns'

import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import Appointment from '../infra/typeorm/entities/appointment'
import User from '@modules/users/infra/typeorm/entities/user'

interface IRequest {
    provider_id: string,
    month: number,
    year: number,
    day: number
}

@injectable()
export default class ListProviderAppointments {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ){}

    public async execute({ 
        provider_id, 
        year, 
        month, 
        day 
    }: IRequest):Promise<Appointment[]>{
       const appointments = await this.appointmentsRepository.findInDayFromProvider({
           day,
           month,
           year,
           provider_id
       })
       
        return appointments 
    }
}