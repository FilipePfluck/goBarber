import { container } from 'tsyringe'

import IMailProvier from './models/IMailProvider'

import EtherealMailProvider from './implementations/EtherealMailProvider'

const providers = {
    ethereal: container.resolve(EtherealMailProvider)
}

/* container.registerInstance<IMailProvier>(
    'MailProvider',
    //mailProviders[mailConfig.driver]
) */