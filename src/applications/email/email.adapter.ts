import nodemailer from 'nodemailer';
import * as process from 'process';
import { emailSubject } from './email.manager';

export const emailAdapter = {
  send() {},
  async sendConfirmToEmail(email: string, confirmationCode: string) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_16_PASSWORD,
      },
    });

    const info = await transport.sendMail({
      from: 'mekerial <liprixgremory01@gmail.com>',
      to: email,
      subject: emailSubject.confirmationRegistration,
      html: `
        <h1>Thanks for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='https://blog-posts3.onrender.com/registration-confirmation?code=${confirmationCode}'>complete registration</a>
        </p>
    `,
    });

    return info;
  },
};
