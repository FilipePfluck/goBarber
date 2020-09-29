import { injectable, inject } from 'tsyringe'
import { getDaysInMonth, getDate, isAfter } from 'date-fns'

import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

import User from '@modules/users/infra/typeorm/entities/user'
import { compare } from 'bcryptjs'

interface IRequest {
    provider_id: string,
    month: number,
    year: number
}

type IResponse = Array<{
    day: number
    available: boolean
}>

@injectable()
export default class ListProviderMonthAvailability {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ){}

    public async execute({ provider_id, year, month }: IRequest):Promise<IResponse>{

        const numberOfDaysInMonth = getDaysInMonth(
            new Date(year, month - 1)
        )

        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (value, index) => index + 1
        )

        const appointments = await this.appointmentsRepository.findInMonthFromProvider({
            provider_id,
            year,
            month
        })

        const availability = eachDayArray.map(day => {
            const compareDate = new Date(year, month -1, day, 23, 59, 59)

            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day
            })

            return {
                day, 
                available: 
                    isAfter(compareDate, new Date()) &&
                    appointmentsInDay.length < 10
            }
        })

        return availability
    }
}