import { CreateUserSessionController } from '@server/auth/controllers/CreateUserSessionControllers';
import { RetrieveSessionController } from '@server/auth/controllers/RetrieveSessionController';
import { SignInController } from '@server/auth/controllers/SigninController';
import { SignoutController } from '@server/auth/controllers/SignoutController';
import { SignupCheckOtpController } from '@server/auth/controllers/SignupCheckOtpController';
import { SignupEmailController } from '@server/auth/controllers/SignupEmailController';
import { SignupSendOTPController } from '@server/auth/controllers/SignupSendOTPController';
import { CreateApplicationController } from '@server/controllers/applications/CreateApplicationController';
import { GetApplicationController } from '@server/controllers/applications/GetApplicationController';
import { RetrieveApplicationsController } from '@server/controllers/applications/RetrieveApplicationsController';
import { CreateChatSessionController } from '@server/controllers/chatSession/CreateChatSessionController';
import { GetChatSessionByResourceController } from '@server/controllers/chatSession/GetChatSessionByResourceController';
import { GetChatSessionsController } from '@server/controllers/chatSession/GetChatSessionController';
import { DeleteCoverletterController } from '@server/controllers/coverletters/DeleteCoverletterController';
import { GetCoverletterController } from '@server/controllers/coverletters/GetCoverletterController';
import { RenameCoverLetterController } from '@server/controllers/coverletters/RenameCoverLetterController';
import { UploadCoverLetterController } from '@server/controllers/coverletters/UploadCoverLetterController';
import { CreateChatMessageController } from '@server/controllers/messages/CreateChatMessageController';
import { GetChatMessagesController } from '@server/controllers/messages/GetChatMessagesController';
import { DeleteResumeController } from '@server/controllers/resumes/DeleteResumesController';
import { GetResumeController } from '@server/controllers/resumes/GetResumeController';
import { RenameResumeController } from '@server/controllers/resumes/RenameResumeController';
import { UploadResumeController } from '@server/controllers/resumes/UploadResumeController';
import { GetUserCoverlettersController } from '@server/controllers/users/GetUserCoverlettersController';
import { GetUserResumeController } from '@server/controllers/users/GetUserResumesController';
import { UploadAvatarController } from '@server/controllers/users/UploadAvatarController';
import { CheckUserExistsController } from '@server/controllers/users/UserExistsController';
import { authMiddleware } from '@server/middleware/authMiddleware';
import { registerController } from '@server/shared/registerController';
import { env } from '@shared/env';
import { pe } from '@shared/utils';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
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
