import { random } from '@shared/utils';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoverletterEntity } from './CoverletterEntity';
import { ResumeEntity } from './ResumeEntity';
import { UserEntity } from './UserEntity';

type ApplicationStatusType =
  | 'applied'
  | 'interviewing'
  | 'accepted'
  | 'rejected';

@Entity({
  name: 'applications',
})
export class ApplicationEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 15,
  })
  id: string = random.nanoid(15);

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ResumeEntity, { nullable: true })
  @JoinColumn({ name: 'resume_id' })
  resume?: ResumeEntity;

  @ManyToOne(() => CoverletterEntity, { nullable: true })
  @JoinColumn({ name: 'coverletter_id' })
  coverletter?: CoverletterEntity;

  @Column({ name: 'employer', type: 'varchar' })
  employer: string;

  @Column({ name: 'job_title', type: 'varchar' })
  jobTitle: string;

  @Column({ name: 'job_url', type: 'varchar', nullable: true })
  jobUrl?: string | null;

  @Column({ name: 'salary_range', type: 'varchar', nullable: true })
  salaryRange?: string | null;

  @Column({ name: 'contact', type: 'varchar', nullable: true })
  contact?: string | null;

  @Column({ name: 'location', type: 'varchar' })
  location: string;

  @Column({
    name: 'platform',
    type: 'enum',
    enum: ['linkedin', 'glassdoor', 'other'],
    default: 'other',
  })
  platform: 'linkedin' | 'glassdoor' | 'other';

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['applied', 'interviewing', 'accepted', 'rejected'],
    default: 'applied',
  })
  status: ApplicationStatusType;

  @Column({ name: 'comments', type: 'text', array: true, default: '{}' })
  comments: string[];

  @Column({ name: 'suggestions', type: 'text', array: true, default: '{}' })
  suggestions: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt?: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @Column({ name: 'locked_at', type: 'timestamptz', nullable: true })
  lockedAt?: Date | null;

  @Column({ name: 'blocked_at', type: 'timestamptz', nullable: true })
  blockedAt?: Date | null;
}
