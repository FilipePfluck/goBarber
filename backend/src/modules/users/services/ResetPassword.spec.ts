import FakeUsersRepository from '../repositories/fakes/fakeUsersRepository'
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import ResetPassword from '../services/ResetPassword'

import SendForgotPasswordEmail from './SendForgotPasswordEmail'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokenRepository: FakeUserTokenRepository
let resetPassword: ResetPassword
let fakeHashProvider: FakeHashProvider

describe('ResetPassword', ()=> {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository()
        fakeUserTokenRepository = new FakeUserTokenRepository()
        fakeHashProvider = new FakeHashProvider()

        resetPassword = new ResetPassword(
            fakeUsersRepository,
            fakeUserTokenRepository,
            fakeHashProvider
        )
    })

    it("should be able to  reset the password", async() => {
        const user = await fakeUsersRepository.create({
            name: "Diego",
            email: "diego@rocketseat.com",
            password: "12345"
        })

        const { token } = await fakeUserTokenRepository.generate(user.id)

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

        await resetPassword.execute({
            password: '123456',
            token
        })

        const updatedUser = await fakeUsersRepository.findById(user.id)

        expect(generateHash).toHaveBeenCalledWith('123456')
        expect(updatedUser?.password).toBe('123456')
    })

    it("should not be able to reset the password with non-existing token", async()=>{
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError)
    })

    it("should not be able to reset the password of an non-existing user", async()=>{
        const {token} = await fakeUserTokenRepository.generate('non-existing-user')
        
        await expect(
            resetPassword.execute({
                token,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError)
    })

    it("should not be able to reset password after 2 hours", async () => {
        const user = await fakeUsersRepository.create({
            name: "Diego",
            email: "diego@rocketseat.com",
            password: "12345"
        })

        const { token } = await fakeUserTokenRepository.generate(user.id)

        jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
            const customDate = new Date()

            return customDate.setHours(customDate.getHours() + 3)
        })

        await expect(resetPassword.execute({
            password: '123456',
            token
        })).rejects.toBeInstanceOf(AppError)

    })
})