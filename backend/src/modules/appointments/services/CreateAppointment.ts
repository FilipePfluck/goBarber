import {startOfHour, isBefore, getHours, format} from 'date-fns'
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import Appointment from '../infra/typeorm/entities/appointment'
import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

interface IRequest {
    date: Date,
    provider_id: string,
    user_id: string
}

@injectable()
class CreateAppointment {
    
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository
    ){}

    public async execute({date, provider_id, user_id}: IRequest): Promise<Appointment>{
        
        console.log(date, provider_id, user_id)

        const appointmentDate = startOfHour(date)

        if(isBefore(appointmentDate, Date.now())){
            throw new AppError('Past date')
        }

        if(user_id === provider_id){
            throw new AppError("You can't make an appointment with yourself")
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17){
            throw new AppError('Invalid hour')
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate)

        if(findAppointmentInSameDate){
            throw new AppError("This appointment has already been booked");
        }

        const appointment = await this.appointmentsRepository.create({
            user_id,
            provider_id,
            date: appointmentDate,
            
        })

        const formatedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'")

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Ǹovo agendamento marcado para ${formatedDate}`
        })

        return appointment
    }
}

export default CreateAppointment