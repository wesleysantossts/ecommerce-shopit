import nodemailer from 'nodemailer'

class Email {
  async sendEmail (options) {
    // criação das configurações de hospedagem de envio do email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: String(process.env.SMTP_AUTH_USER),
        pass: String(process.env.SMTP_AUTH_PASSWORD)
      }
    });

    // configurações de envio da mensagem
    const mensagem = {
      from: `ShopIt <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message 
    }

    // sendMail(mensagem) - método de envio de email do nodemailer
    await transporter.sendMail(mensagem)
      .catch(error => console.log('Erro ao enviar o email', error))
  }
}

export default new Email()