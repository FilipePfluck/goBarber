import Appointment from '../infra/typeorm/entities/appointment'
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO'
import IFindInMonthFromProviderDTO from '../dtos/IFindInMonthFromProviderDTO'
import IFindInDayFromProviderDTO from '../dtos/IFindInDayFromProviderDTO'

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>
    findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> 
    findInMonthFromProvider(
        data:IFindInMonthFromProviderDTO
    ): Promise<Appointment[]>
    findInDayFromProvider(
        data: IFindInDayFromProviderDTO
    ): Promise<Appointment[]>
}