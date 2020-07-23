import FakeUsersRepository from '../repositories/fakes/fakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import CreateUser from './createUser'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUser

describe('CreateUser', ()=> {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository()
        fakeHashProvider = new FakeHashProvider()

        createUser = new CreateUser(fakeUsersRepository, fakeHashProvider)
    })

    it("should be able to create a new user", async() => {
        const user = await createUser.execute({
            name: "Diego",
            email: "adasd@gmasdias.com",
            password: "123456"
        })

        expect(user).toHaveProperty('id')
    })

    it("shouldn't be able to create two users with the same email", async() => {
        const user = await createUser.execute({
            name: "Diego",
            email: "adasd@gmasdias.com",
            password: "123456"
        })

        await expect(createUser.execute({
            name: "Diego",
            email: "adasd@gmasdias.com",
            password: "123456"
        })).rejects.toBeInstanceOf(AppError)
    })
})