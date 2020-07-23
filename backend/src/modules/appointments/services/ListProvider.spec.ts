import FakeUsersRepository from '@modules/users/repositories/fakes/fakeUsersRepository'

import ListProvider from './ListProvider'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let listProvider: ListProvider

describe('ListProvider', ()=> {
    beforeEach(()=>{
        fakeUsersRepository = new FakeUsersRepository()

        listProvider = new ListProvider(fakeUsersRepository)
    })

    it("should be able to list all providers", async() => {
        const user1 = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johndoe@example.com',
            password: '12345'
        })

        const user2 = await fakeUsersRepository.create({
            name: 'jane doe',
            email: 'janedoe@example.com',
            password: '12345'
        })

        const loggedUser = await fakeUsersRepository.create({
            name: 'logged user',
            email: 'loggeduser@example.com',
            password: '12345'
        })

        const providers = await listProvider.execute({
            except_user_id: loggedUser.id
        })

        expect(providers).toEqual([user1, user2])
    })

})