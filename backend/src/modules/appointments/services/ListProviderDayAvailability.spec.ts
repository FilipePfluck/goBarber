import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderDayAvailability from './ListProviderDayAvailability'

import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderDayAvailability: ListProviderDayAvailability

describe('ListProviderMonthAvailability', ()=> {
    beforeEach(()=>{
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        listProviderDayAvailability = new ListProviderDayAvailability(fakeAppointmentsRepository)
    })

    it("should be able to list the month availability from a specific provider", async() => {

        await fakeAppointmentsRepository.create({
            user_id: 'user_id',
            provider_id: 'provider_id',
            date: new Date(2020, 6, 20, 10, 0, 0)
        })

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 6, 20, 9, 0, 0).getTime()

        })

        const availability = await listProviderDayAvailability.execute({
            provider_id: 'provider_id',
            year: 2020,
            month: 7,
            day: 20,
        })

        expect(availability).toEqual(expect.arrayContaining([
            {available: false, hour: 8},
            {available: false, hour: 9},
            {available: false, hour: 10},
            {available: true, hour: 11},
        ]))
    })

})