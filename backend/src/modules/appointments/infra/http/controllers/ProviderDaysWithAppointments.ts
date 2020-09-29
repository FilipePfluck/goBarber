import { Request, Response } from 'express'
import { parseISO } from 'date-fns'
import { container } from 'tsyringe'

import ListProviderDaysWithAppointmentsInMonth from '@modules/appointments/services/ListProviderDaysWithAppointmentsInMonth'

export default class ProviderDaysWIthAppointmentsInMonthController {
    public async index(request: Request, response: Response): Promise<Response>{
        console.log('controller')

        const { provider_id } = request.params
        const { month, year } = request.query

        console.log(provider_id, month, year)

        const listProviderDaysWithAppointments = container.resolve(ListProviderDaysWithAppointmentsInMonth)

        const daysWithAppointments = await listProviderDaysWithAppointments.execute({
            month: Number(month),
            year: Number(year),
            provider_id
        })

        return response.json(daysWithAppointments)
    }
}