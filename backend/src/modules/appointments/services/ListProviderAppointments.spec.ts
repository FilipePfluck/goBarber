import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderAppointments from './ListProviderAppointments'

import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderAppointments: ListProviderAppointments

describe('ListProviderAppointments', ()=> {
    beforeEach(()=>{
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        listProviderAppointments = new ListProviderAppointments(fakeAppointmentsRepository)
    })

    it("should be able to list the appointments in a specific day from a specific provider", async() => {

        const appointment1 = await fakeAppointmentsRepository.create({
            user_id: 'user1',
            provider_id: 'provider_id',
            date: new Date(2020, 6, 20, 10, 0, 0)
        })

        const appointment2 = await fakeAppointmentsRepository.create({
            user_id: 'user2',
            provider_id: 'provider_id',
            date: new Date(2020, 6, 20, 12, 0, 0)
        })

        const appointment3 = await fakeAppointmentsRepository.create({
            user_id: 'user3',
            provider_id: 'provider_id',
            date: new Date(2020, 6, 20, 14, 0, 0)
        })

        const appointment4 = await fakeAppointmentsRepository.create({
            user_id: 'user4',
            provider_id: 'provider_id',
            date: new Date(2020, 6, 20, 15, 0, 0)
        })

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 6, 20, 9, 0, 0).getTime()

        })

        const appointments = await listProviderAppointments.execute({
            provider_id: 'provider_id',
            year: 2020,
            month: 7,
            day: 20,
        })

        expect(appointments).toEqual([
            appointment1, appointment2, appointment3, appointment4
        ])
    })

})