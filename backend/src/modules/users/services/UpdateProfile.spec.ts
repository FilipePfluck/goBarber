import FakeUsersRepository from '../repositories/fakes/fakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import UpdateProfile from './UpdateProfile'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfile

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeHashProvider = new FakeHashProvider

        updateProfile = new UpdateProfile(fakeUsersRepository, fakeHashProvider)
    })

    it("should be able to update the profile", async () => {
        const user = await fakeUsersRepository.create({
            name: "Diego",
            email: "adasd@gmasdias.com",
            password: "123456"
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            email: 'diego@gmail.com',
            name: 'Diego',
        })

        expect(updatedUser.name).toBe('Diego')
        expect(updatedUser.email).toBe('diego@gmail.com')
    })

    it("should not be able to change the email into an already used one", async () => {
        await fakeUsersRepository.create({
            name: "Teste",
            email: "teste@gmail.com",
            password: "123456"
        })
        
        const user = await fakeUsersRepository.create({
            name: "Diego",
            email: "diego@gmail.com",
            password: "123456"
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            email: 'teste@gmail.com',
            name: 'Diego',
            old_password: '123456',
            password: '12345678'
        })).rejects.toBeInstanceOf(AppError)

    })

    it("should be able to update the password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Diego",
            email: "adasd@gmasdias.com",
            password: "123456"
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            email: 'diego@gmail.com',
            name: 'Diego',
            old_password: "123456",
            password: '12345678'
        })

        expect(updatedUser.password).toBe('12345678')
    })

    it("should not be able to update the password without informing the old password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Diego",
            email: "adasd@gmasdias.com",
            password: "123456"
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            email: 'diego@gmail.com',
            name: 'Diego',
            password: '12345678'
        })).rejects.toBeInstanceOf(AppError)
    })

    it("should not be able to update the password with wrong old password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Diego",
            email: "adasd@gmasdias.com",
            password: "123456"
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            email: 'diego@gmail.com',
            name: 'Diego',
            password: '12345678',
            old_password: 'wrong-old-password'
        })).rejects.toBeInstanceOf(AppError)
    })
})