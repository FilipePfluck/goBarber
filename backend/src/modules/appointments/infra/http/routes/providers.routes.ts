import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'

import Joi from '@hapi/joi'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import ProvidersController from '../controllers/ProvidersController'
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController'
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController'
import ProviderDaysWithAppointments from '../controllers/ProviderDaysWithAppointments'

const providersRouter = Router()

const providersController = new ProvidersController()
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController()
const providerDayAvailabilityController = new ProviderDayAvailabilityController()
const providerDaysWithAppointments = new ProviderDaysWithAppointments()

providersRouter.use(ensureAuthenticated)

providersRouter.get('/', providersController.index)

providersRouter.get(
    '/:provider_id/month-availability', 
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required()
        }
    }),
    providerMonthAvailabilityController.index
)

providersRouter.get(
    '/:provider_id/day-availability', 
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required()
        }
    }),
    providerDayAvailabilityController.index
)

providersRouter.get(
    '/:provider_id/days-with-appointments', 
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required()
        }
    }),
    providerDaysWithAppointments.index
)

export default providersRouter