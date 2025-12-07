import nodemailer from 'nodemailer';
import type { Mailer, SendMailParams } from './types';

export class DevMailer implements Mailer {
  private transporter = nodemailer.createTransport({
    url: 'smtp://localhost:1025',
  });

  async send({
    to,
    subject,
    html,
    fromEmail,
    fromName,
  }: SendMailParams): Promise<void> {
    const from = `${fromName || 'EasyResPlus'} <${fromEmail || process.env.MAIL_FROM || 'no-reply@easyresplus'}>`;
    await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  }
}
