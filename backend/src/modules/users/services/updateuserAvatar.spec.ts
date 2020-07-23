import FakeUsersRepository from '../repositories/fakes/fakeUsersRepository'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'

import UpdateUserAvatar from './updateUserAvatar'

import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeStorageProvider: FakeStorageProvider
let updateUserAvatar: UpdateUserAvatar

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeStorageProvider = new FakeStorageProvider()

        updateUserAvatar = new UpdateUserAvatar(fakeUsersRepository, fakeStorageProvider)
    })

    it("should be able to update an user's avatar", async () => {
        const user = await fakeUsersRepository.create({
            name: "Diego",
            email: "adasd@gmasdias.com",
            password: "123456"
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        })

        expect(user.avatar).toBe('avatar.jpg')
    })

    it("shouldn't be able to update the avatar of an inexistent user", async () => {

        await expect(updateUserAvatar.execute({
            user_id: 'non-existing user',
            avatarFilename: 'avatar.jpg'
        })).rejects.toBeInstanceOf(AppError)
    })

    it("should delete the old avatar when updating", async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

        const updateUserAvatar = new UpdateUserAvatar(fakeUsersRepository, fakeStorageProvider)

        const user = await fakeUsersRepository.create({
            name: "Diego",
            email: "adasd@gmasdias.com",
            password: "123456"
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg'
        })

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')
        expect(user.avatar).toBe('avatar2.jpg')
    })
})