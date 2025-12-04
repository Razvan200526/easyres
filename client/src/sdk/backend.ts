import { ApplicationFetcher } from './ApplicationFetcher';
import { AuthFetcher } from './AuthFetcher';
import { ChatFetcher } from './ChatFetcher';
import { CoverLetterFetcher } from './CoverLetterFetcher';
import type { Fetcher } from './Fetcher';
import { MessageFetcher } from './MessageFetcher';
import { ResumeFetcher } from './ResumeFetcher';
import { Socket } from './Socket';
import { UploadFetcher } from './UploadFetcher';
import { UserFetcher } from './UserFetcher';

export class Backend {
  public readonly auth: AuthFetcher;
  public readonly users: UserFetcher;
  public readonly upload: UploadFetcher;
  public readonly resume: ResumeFetcher;
  public readonly coverLetter: CoverLetterFetcher;
  public readonly message: MessageFetcher;
  public readonly chat: ChatFetcher;
  public readonly apps: ApplicationFetcher;
  public readonly socket: Socket;
  constructor(readonly fetcher: Fetcher) {
    this.auth = new AuthFetcher(this.fetcher);
    this.users = new UserFetcher(this.fetcher);
    this.upload = new UploadFetcher(this.fetcher);
    this.resume = new ResumeFetcher(this.fetcher);
    this.coverLetter = new CoverLetterFetcher(this.fetcher);
    this.message = new MessageFetcher(this.fetcher);
    this.chat = new ChatFetcher(this.fetcher);
    this.apps = new ApplicationFetcher(this.fetcher);
    this.socket = new Socket(
      import.meta.env.VITE_PY_URL || 'ws://localhost:8000',
    );
  }
}
