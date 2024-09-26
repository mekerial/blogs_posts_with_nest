import nodemailer from 'nodemailer';
import * as process from 'process';
import { emailSubject } from './email.manager';

const url = 'https://e5f9-37-122-53-136.ngrok-free.app/'; //process.env.URL || 'https://blogs-posts-with-nest.onrender.com/';

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

    const info = transport.sendMail({
      from: 'mekerial <liprixgremory01@gmail.com>',
      to: email,
      subject: emailSubject.confirmationRegistration,
      html: `
        <h1>Thanks for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href= '${url}auth/registration-confirmation?code=${confirmationCode}'>complete registration</a>
        </p>
    `,
    });

    return info;
  },
  async sendRecoveryPasswordToEmail(email: string, confirmationCode: string) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_16_PASSWORD,
      },
    });

    const info = transport.sendMail({
      from: 'mekerial <liprixgremory01@gmail.com>',
      to: email,
      subject: emailSubject.passwordRecovery,
      html: `
        <h1>Password recovery</h1>
        <p>To recovery password use this link:
        <a href='${url}auth/new-password?recoveryCode=${confirmationCode}'>password recovery</a>
        </p>`,
    });
    return info;
  },
};
