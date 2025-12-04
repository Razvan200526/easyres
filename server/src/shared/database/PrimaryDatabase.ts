import { env } from '@shared/env';
import { pe } from '@shared/utils';
import {
  DataSource,
  type EntityManager,
  type EntityTarget,
  type ObjectLiteral,
  type Repository,
} from 'typeorm';
import { PrimaryEntities } from './entities';

export class PrimaryDatabase {
  private source: DataSource | undefined; //see why it complains without undefined
  private url: string;
  constructor() {
    if (!env.DATABASE_URL) {
      throw new Error('DATABASE_URL needs to be in .env');
    }
    this.url = env.DATABASE_URL;
  }

  public getSource(): DataSource {
    if (this.source) {
      return this.source;
    }

    try {
      this.source = new DataSource({
        type: 'postgres',
        url: this.url,
        synchronize: true,
        entities: PrimaryEntities,
        extra: {
          max: 10,
        },
      });
    } catch (error) {
      console.error(pe.render('Error initializing PrimaryDatabase'));
      throw error;
    }

    return this.source;
  }

  public async open<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
  ): Promise<Repository<Entity>> {
    const source = this.getSource();

    if (!source.isInitialized) {
      await source.initialize();
    }

    return source.getRepository(entity);
  }

  public async close(): Promise<void> {
    const source = this.getSource();
    if (source.isInitialized) {
      await source.destroy();
    }
  }

  public getEntityManager(): EntityManager {
    return this.getSource().manager;
  }
}

export const primaryDatabase = new PrimaryDatabase();
