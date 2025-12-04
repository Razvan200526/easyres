import { env } from '@shared/env';
import { color } from 'console-log-colors';
import { createTransport } from 'nodemailer';
import type { Mailer, SendMailParams } from './types';
export class PrimaryMailer implements Mailer {
  private apiKey: string;

  constructor() {
    console.debug(color.bgRedBright('Creating primary mailer'));

    //@ts-ignore
    this.apiKey = env.RESEND_API_KEY || '';
  }

  public async send({ to, subject, html }: SendMailParams): Promise<void> {
    if (!this.apiKey) {
      console.error('RESEND_API_KEY is not set - cannot send email');
      throw new Error('Mail configuration error: RESEND_API_KEY is not set');
    }

    const mailer = createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: this.apiKey,
      },
    });
    await mailer.sendMail({
      from: '"EasyRes" <welcome@resumetracker.me>',
      to,
      subject,
      html,
    });
  }
}
