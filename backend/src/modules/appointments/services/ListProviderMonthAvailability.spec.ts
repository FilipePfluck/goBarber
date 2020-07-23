import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderMonthAvailability from './ListProviderMonthAvailability'

import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderMonthAvailability: ListProviderMonthAvailability

describe('ListProviderMonthAvailability', ()=> {
    beforeEach(()=>{
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        listProviderMonthAvailability = new ListProviderMonthAvailability(fakeAppointmentsRepository)
    })

    it("should be able to list the month availability from a specific provider", async() => {

        for(let i=8; i<=17; i++){
            await fakeAppointmentsRepository.create({
                user_id: "user_id",
                provider_id: 'provider_id',
                date: new Date(2020, 9, 20, i, 0, 0)
            })
        }

        const availability = await listProviderMonthAvailability.execute({
            provider_id: 'provider_id',
            year: 2020,
            month: 9
        })

        expect(availability).toEqual(expect.arrayContaining([
            {day: 19, available: true},
            {day: 20, available: false},
        ]))
    })

})