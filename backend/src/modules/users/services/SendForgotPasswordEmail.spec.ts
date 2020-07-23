import FakeUsersRepository from '../repositories/fakes/fakeUsersRepository'
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'

import SendForgotPasswordEmail from './SendForgotPasswordEmail'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokenRepository: FakeUserTokenRepository
let fakeMailProvider: FakeMailProvider
let sendForgotPasswordEmail: SendForgotPasswordEmail

describe('SendForgotPasswordEmail', ()=> {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository()
        fakeUserTokenRepository = new FakeUserTokenRepository()
        fakeMailProvider = new FakeMailProvider()

        sendForgotPasswordEmail = new SendForgotPasswordEmail(
            fakeUsersRepository, 
            fakeMailProvider,
            fakeUserTokenRepository
        )
    })

    it("should be able to recover the password informing the email", async() => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

        await fakeUsersRepository.create({
            name: "Diego",
            email: "Diego@rocketseat.com",
            password: "12312"
        })

        const user = await sendForgotPasswordEmail.execute({email: "Diego@rocketseat.com"})

        expect(sendMail).toHaveBeenCalled()
    })

    it("should not be able to send email to an inexistent user", async ()=> {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

        await expect(
            sendForgotPasswordEmail.execute({
                email: "Diego@rocketseat.com"
            })
        ).rejects.toBeInstanceOf(AppError)
    })

    it("should generate a forgot password token", async ()=>{
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')
        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate')

        const user = await fakeUsersRepository.create({
            name: "Diego",
            email: "Diego@rocketseat.com",
            password: "12312"
        })

        await sendForgotPasswordEmail.execute({email: "Diego@rocketseat.com"})

        expect(generateToken).toHaveBeenCalledWith(user.id)
    })
})