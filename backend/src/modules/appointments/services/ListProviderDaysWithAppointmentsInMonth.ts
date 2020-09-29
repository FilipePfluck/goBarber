import { injectable, inject } from 'tsyringe'
import { getHours, isAfter, getDaysInMonth, isSameDay } from 'date-fns'

import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import Appointment from '../infra/typeorm/entities/appointment'
import User from '@modules/users/infra/typeorm/entities/user'

interface IRequest {
    provider_id: string,
    month: number,
    year: number,
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
    }: IRequest):Promise<number[] | undefined>{
        console.log('days with appointments in month service')

        const numberOfDaysInMonth = getDaysInMonth(
            new Date(year, month - 1)
        )

        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (value, index) => index + 1
        )

        const appointments = await this.appointmentsRepository.findInMonthFromProvider({
           month,
           year,
           provider_id
        })


        const daysWithAppointments = eachDayArray.filter(day=>{
            return appointments.some(
                appointment => isSameDay(appointment.date, new Date(year, month - 1, day)
            ))
                 
        
        })

        if(daysWithAppointments){
            return daysWithAppointments
        }
    }
}