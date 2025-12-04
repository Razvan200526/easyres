import {
  ApplicationEntity,
  ChatMessageEntity,
  ChatSessionEntity,
  CoverletterEntity,
  ResumeEntity,
  UserAccountEntity,
  UserEntity,
  UserSessionEntity,
  UserVerificationEntity,
} from '@server/entities';

export const PrimaryEntities = [
  UserEntity,
  UserAccountEntity,
  UserSessionEntity,
  UserVerificationEntity,
  ResumeEntity,
  CoverletterEntity,
  ChatMessageEntity,
  ChatSessionEntity,
  ApplicationEntity,
];
