export type SendMailParams = {
  to: string[];
  subject: string;
  html: string;
  fromName?: string;
  fromEmail?: string;
};

export interface Mailer {
  send(params: SendMailParams): Promise<void>;
}
