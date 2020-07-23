import { container } from 'tsyringe'

import IMailProvider from './MailProvider/models/IMailProvider'
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider'

import IStorageProvider from './StorageProvider/models/IStorageProvider'
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider'

import IUserTokensRepository from '@modules/users/repositories/IUserTokenRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarMailsTempletateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider
)

container.registerSingleton<IUserTokensRepository>(
    'UserTokensRepository',
    UserTokensRepository,
  )

container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    HandlebarMailsTempletateProvider,
)

container.registerInstance<IMailProvider>(
    'MailProvider',
    container.resolve(EtherealMailProvider)
)