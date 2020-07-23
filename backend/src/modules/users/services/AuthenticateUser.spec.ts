import FakeUsersRepository from '../repositories/fakes/fakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import AuthenticateUser from './AuthenticateUser'
import CreateUser from './createUser'
 
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUser
let authenticateUser: AuthenticateUser

describe('AuthenticateUser', ()=> {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository()
        fakeHashProvider = new FakeHashProvider()

        createUser = new CreateUser(fakeUsersRepository, fakeHashProvider)
        authenticateUser = new AuthenticateUser(fakeUsersRepository, fakeHashProvider)
    })

    it("should be able to authenticate a user", async() => {
        await createUser.execute({
            name: "asdasdasd",
            email: "asdasd@gmail.com",
            password: "1234"
        })

        const response = await authenticateUser.execute({
            email: "asdasd@gmail.com",
            password: "1234"
        })

        expect(response).toHaveProperty('token')
    })

    it("shouldn't be able to authenticate an inexistent user", async() => {

        await expect(authenticateUser.execute({
            email: "asdasd@gmail.com",
            password: "1234"
        })).rejects.toBeInstanceOf(AppError)
    })

    it("shouldn't be able to authenticate a user with an incorrect password", async() => {
        
        await createUser.execute({
            name: "asdasdasd",
            email: "asdasd@gmail.com",
            password: "1234"
        })

        await expect(authenticateUser.execute({
            email: "asdasd@gmail.com",
            password: "123456"
        })).rejects.toBeInstanceOf(AppError)
    })
})