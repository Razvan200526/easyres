import type { UserEntity } from '@server/entities';
import { random } from '@shared/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('resumes')
export class ResumeEntity {
  @PrimaryColumn({ type: 'varchar', length: 15 })
  id: string = random.nanoid(15);

  @ManyToOne('UserEntity', 'resumes')
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar' })
  filename: string;

  @Column({ type: 'text' })
  url: string; // The R2 URL or key

  @Column({ type: 'varchar', nullable: true })
  filetype: string;

  @Column({ type: 'int', nullable: true })
  filesize: number;

  @CreateDateColumn()
  uploadedAt: Date;

  // Add more metadata fields as needed
}
