import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'

import CreateAppointment from './CreateAppointment'

import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let createAppointment: CreateAppointment
let fakeNotificationsRepository: FakeNotificationsRepository

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        fakeNotificationsRepository = new FakeNotificationsRepository()

        createAppointment = new CreateAppointment(fakeAppointmentsRepository, fakeNotificationsRepository)
    })

    it('should be able to create a new appointment', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
            return new Date(2020, 4, 10, 12).getTime()
        })

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            provider_id: 'test1',
            user_id: 'asdasdasdasdasdasd'
        })

        expect(appointment).toHaveProperty('id')
    })

    it('should not be able to create two appointments on the same time', async () => {
        const appointmentDate = new Date()
    
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
          return new Date(2020, 4, 10, 12).getTime()
        })
    
        await createAppointment.execute({
          date: appointmentDate,
          provider_id: 'provider_id',
          user_id: 'user_id',
        })
    
        await expect(
          createAppointment.execute({
            date: appointmentDate,
            provider_id: 'provider_id',
            user_id: 'user_id',
          }),
        ).rejects.toBeInstanceOf(AppError)
    })

    it("shouldn't be able to create an appointment in a past date", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
            return new Date(2020, 4, 10, 12).getTime()
        })

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 8, 10),
            provider_id: 'test3',
            user_id: 'asdasdasdasdasdasd'
        })).rejects.toBeInstanceOf(AppError)
    })

    it("should not be able to create an appointment with yourself", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
            return new Date(2020, 4, 10, 12).getTime()
        })

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 12, 10),
            provider_id: 'user1',
            user_id: 'user1'
        })).rejects.toBeInstanceOf(AppError)
    })

    it("should not be able to create an appointment in invalid hour", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
            return new Date(2020, 4, 10, 12).getTime()
        })

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 12, 7),
            provider_id: 'user2',
            user_id: 'user1'
        })).rejects.toBeInstanceOf(AppError)

        await expect(createAppointment.execute({
            date: new Date(2020, 4, 12, 18),
            provider_id: 'user2',
            user_id: 'user1'
        })).rejects.toBeInstanceOf(AppError)
    })
})