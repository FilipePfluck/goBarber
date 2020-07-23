import { injectable, inject } from 'tsyringe'
import { getHours, isAfter } from 'date-fns'

import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

import User from '@modules/users/infra/typeorm/entities/user'
import { compare } from 'bcryptjs'

interface IRequest {
    provider_id: string,
    month: number,
    year: number,
    day: number
}

type IResponse = Array<{
    hour: number
    available: boolean
}>

@injectable()
export default class ListProviderDayAvailability {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ){}

    public async execute({ 
        provider_id, 
        year, 
        month, 
        day 
    }: IRequest):Promise<IResponse>{
        const appointments = await this.appointmentsRepository.findInDayFromProvider({
            provider_id, 
            year, 
            month, 
            day 
        })

        const hourStart = 8

        const eachHourArray = Array.from(
            { length: 10},
            (value, index) => index + hourStart
        )
        
        const currentDate = new Date(Date.now())

        const availability = eachHourArray.map(hour => {
            const hasAppointmentInHour = appointments.find(appointment => {
                return getHours(appointment.date) === hour
            })

            const compareDate = new Date(year, month - 1, day, hour)

            console.log(compareDate, currentDate, (!hasAppointmentInHour && isAfter(compareDate, currentDate)))

            return {
                hour,
                available: !hasAppointmentInHour && isAfter(compareDate, currentDate)
            }
        })

        return availability
    }
}