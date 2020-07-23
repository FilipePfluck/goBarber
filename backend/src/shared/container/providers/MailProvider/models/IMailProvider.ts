import ISendMailDTO from '../../MailProvider/dtos/ISendMailDTO'

export default interface IMailProvier {
    sendMail(data: ISendMailDTO): Promise<void>
}