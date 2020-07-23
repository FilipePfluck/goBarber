import { uuid } from 'uuidv4'
import { isEqual, getMonth, getYear,getDate } from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindInMonthFromProviderDTO from '@modules/appointments/dtos/IFindInMonthFromProviderDTO'
import IFindInDayFromProviderDTO from '@modules/appointments/dtos/IFindInDayFromProviderDTO'

import Appointment from '../../infra/typeorm/entities/appointment'

class AppointmentsRepository 
    implements IAppointmentsRepository{
        private appointments: Appointment[] = []

        public async findByDate(date: Date): Promise<Appointment | undefined> {
            const findAppointment = this.appointments.find(appointment =>
              isEqual(appointment.date, date),
            )
        
            return findAppointment
          }

        public async findInMonthFromProvider(
            {provider_id, month, year}: IFindInMonthFromProviderDTO
        ): Promise<Appointment[]>{
            const appointments = this.appointments.filter(appointment => {
                return (
                    appointment.provider_id === provider_id && 
                    getMonth(appointment.date) + 1 === month &&
                    getYear(appointment.date) === year
                )
            })

            return appointments
        }

        public async findInDayFromProvider(
            {provider_id, day, month, year}: IFindInDayFromProviderDTO
        ): Promise<Appointment[]>{
            const appointments = this.appointments.filter(appointment => {
                return (
                    appointment.provider_id === provider_id && 
                    getDate(appointment.date) === day &&
                    getMonth(appointment.date) + 1 === month &&
                    getYear(appointment.date) === year
                )
            })

            return appointments
        }

        public async create(
            { date, provider_id, user_id }: ICreateAppointmentDTO
        ): Promise<Appointment>{
            const appointment = new Appointment()

            appointment.id = uuid()
            appointment.date = date
            appointment.provider_id = provider_id
            appointment.user_id = user_id

            this.appointments.push(appointment)

            return appointment
        }
    }

export default AppointmentsRepository