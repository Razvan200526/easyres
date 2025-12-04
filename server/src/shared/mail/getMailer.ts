import { env } from '@shared/env';
import { DevMailer } from './DevMailer';
import { PrimaryMailer } from './PrimaryMailer';
import type { Mailer } from './types';

export function getMailer(): Mailer {
  if (env.NODE_ENV === 'production') {
    return new PrimaryMailer();
  }
  return new DevMailer();
}
