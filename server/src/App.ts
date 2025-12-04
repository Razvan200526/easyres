import { env } from '@shared/env';
import { pe } from '@shared/utils';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { CreateUserSessionController } from './auth/controllers/CreateUserSessionControllers';
import { RetrieveSessionController } from './auth/controllers/RetrieveSessionController';
import { SignInController } from './auth/controllers/SigninController';
import { SignoutController } from './auth/controllers/SignoutController';
import { SignupCheckOtpController } from './auth/controllers/SignupCheckOtpController';
import { SignupEmailController } from './auth/controllers/SignupEmailController';
import { SignupSendOTPController } from './auth/controllers/SignupSendOTPController';
import { CreateApplicationController } from './controllers/applications/CreateApplicationController';
import { GetApplicationController } from './controllers/applications/GetApplicationController';
import { RetrieveApplicationsController } from './controllers/applications/RetrieveApplicationsController';
import { CreateChatSessionController } from './controllers/chatSession/CreateChatSessionController';
import { GetChatSessionByResourceController } from './controllers/chatSession/GetChatSessionByResourceController';
import { GetChatSessionsController } from './controllers/chatSession/GetChatSessionController';
import { DeleteCoverletterController } from './controllers/coverletters/DeleteCoverletterController';
import { GetCoverletterController } from './controllers/coverletters/GetCoverletterController';
import { RenameCoverLetterController } from './controllers/coverletters/RenameCoverLetterController';
import { UploadCoverLetterController } from './controllers/coverletters/UploadCoverLetterController';
import { CreateChatMessageController } from './controllers/messages/CreateChatMessageController';
import { GetChatMessagesController } from './controllers/messages/GetChatMessagesController';
import { DeleteResumeController } from './controllers/resumes/DeleteResumesController';
import { GetResumeController } from './controllers/resumes/GetResumeController';
import { RenameResumeController } from './controllers/resumes/RenameResumeController';
import { UploadResumeController } from './controllers/resumes/UploadResumeController';
import { GetUserCoverlettersController } from './controllers/users/GetUserCoverlettersController';
import { GetUserResumeController } from './controllers/users/GetUserResumesController';
import { UploadAvatarController } from './controllers/users/UploadAvatarController';
import { CheckUserExistsController } from './controllers/users/UserExistsController';
import { authMiddleware } from './middleware/authMiddleware';
import { registerController } from './shared/registerController';
export const app = new Hono();
app.use(logger());

app.use(
  cors({
    origin: env.CORS_ORIGINS?.split(','),
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

registerController(app, SignupEmailController);
registerController(app, SignupCheckOtpController);
registerController(app, SignInController);
registerController(app, CheckUserExistsController);

app.use('/api/auth/session', authMiddleware);
registerController(app, RetrieveSessionController);
registerController(app, CreateUserSessionController);
registerController(app, SignoutController);

app.use('/api/chat/*', authMiddleware);
app.use('/api/resumes/*', authMiddleware);
app.use('/api/coverletter/*', authMiddleware);
app.use('/api/coverletters/*', authMiddleware);

registerController(app, UploadAvatarController);
registerController(app, UploadResumeController);
registerController(app, GetUserResumeController);
registerController(app, DeleteResumeController);
registerController(app, GetUserCoverlettersController);
registerController(app, UploadCoverLetterController);
registerController(app, DeleteCoverletterController);
registerController(app, GetCoverletterController);
registerController(app, GetResumeController);

registerController(app, GetChatSessionsController);
registerController(app, CreateChatSessionController);
registerController(app, GetChatSessionByResourceController);
registerController(app, GetChatMessagesController);
registerController(app, CreateChatMessageController);
registerController(app, CreateApplicationController);
registerController(app, RetrieveApplicationsController);
registerController(app, GetApplicationController);
registerController(app, RenameResumeController);
registerController(app, RenameCoverLetterController);
registerController(app, SignupSendOTPController);

app.post('/api/auth/signup', async (c) => {
  const ctrl = new SignupEmailController();
  return await ctrl.handler(c);
});

app.get('/', async (c) => {
  return c.json({ message: 'health check passed' });
});

app.onError((err, c) => {
  return c.json({ success: false, error: err.message }, 500);
});

app.notFound((c) => {
  console.error(pe.render('Not found error'));
  return c.json({ success: false, error: 'Not found error' }, 500);
});
