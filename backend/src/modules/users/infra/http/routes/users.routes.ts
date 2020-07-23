import { Router } from 'express'
import multer from 'multer'
import { celebrate, Segments, Joi } from 'celebrate'

import uploadConfig from '@config/upload'

import UsersController from '../controllers/UsersController'
import UserAvatarController from '../controllers/UserAvatarController'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const usersRouter = Router()
const upload = multer(uploadConfig)

const usersContoller = new UsersController()
const userAvatarController = new UserAvatarController()

usersRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email:  Joi.string().email().required(),
            password: Joi.string().required()   
        }
    }), 
    usersContoller.create
)

usersRouter.patch(
    '/avatar', 
    ensureAuthenticated, 
    upload.single('avatar'),
    userAvatarController.update
)

usersRouter.put(
    '/profile', 
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            old_password: Joi.string(),
            password: Joi.string(),
            password_confirmation: Joi.string().valid(Joi.ref('password'))
        }
    }),
    ensureAuthenticated ,usersContoller.update
)

usersRouter.get('/profile', ensureAuthenticated ,usersContoller.show)

export default usersRouter