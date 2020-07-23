import { Repository, getRepository, Raw } from 'typeorm'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindInMonthFromProviderDTO from '@modules/appointments/dtos/IFindInMonthFromProviderDTO'
import IFindInDayFromProviderDTO from '@modules/appointments/dtos/IFindInDayFromProviderDTO'

import Appointment from '../entities/appointment'
import { parse } from 'date-fns'

class AppointmentsRepository 
    implements IAppointmentsRepository{
    
        private ormRepository: Repository<Appointment>

        constructor(){
            this.ormRepository = getRepository(Appointment)
        }

        public async findByDate(date: Date): Promise<Appointment | undefined> {

            const findAppointment = await this.ormRepository.findOne({
                where: { date }
            })

            return findAppointment
        }

        public async findInMonthFromProvider(
            {provider_id, month, year}: IFindInMonthFromProviderDTO
        ): Promise<Appointment[]>{
            const parsedMonth = String(month).padStart(2, '0')
            
            const appointment = this.ormRepository.find({
                where: {
                    provider_id,
                    date: Raw(dateFieldName => 
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`    
                    )
                }
            })
            
            return []
        }

        public async findInDayFromProvider(
            {provider_id, day, month, year}: IFindInDayFromProviderDTO
        ): Promise<Appointment[]>{
            const parsedMonth = String(month).padStart(2, '0')
            const parsedDay = String(day).padStart(2, '0')
            
            const appointment = this.ormRepository.find({
                where: {
                    provider_id,
                    date: Raw(dateFieldName => 
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`    
                    )
                }
            })
            
            return []
        }

        public async create({ date, provider_id, user_id }: ICreateAppointmentDTO): Promise<Appointment>{
            const appointment = this.ormRepository.create({ provider_id, date, user_id })

            await this.ormRepository.save(appointment)

            return appointment
        }
    }

export default AppointmentsRepository