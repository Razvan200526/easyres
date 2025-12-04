import {
  type PrimaryDatabase,
  primaryDatabase,
} from '@server/shared/database/PrimaryDatabase';
import type {
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { UserSessionEntity } from '../entities/UserSessionEntity';

export class UserSessionRepository {
  private readonly database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }

  public async open(): Promise<Repository<UserSessionEntity>> {
    return await this.database.open(UserSessionEntity);
  }

  public async close(): Promise<void> {
    await this.database.close();
  }

  public async find(
    criteria: FindManyOptions<UserSessionEntity>,
  ): Promise<UserSessionEntity[] | null> {
    const repository = await this.open();

    return await repository.find(criteria);
  }

  public async findOne(id: string): Promise<UserSessionEntity | null> {
    const repository = await this.open();

    return await repository.findOne({
      relations: {
        user: true,
      },
      where: { id },
    });
  }

  public async findOneBy(
    criteria: FindOptionsWhere<UserSessionEntity>,
  ): Promise<UserSessionEntity | null> {
    const repository = await this.open();

    return await repository.findOne({
      relations: {
        user: true,
      },
      where: criteria,
    });
  }

  public async findOneOrFail(id: string): Promise<UserSessionEntity> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new Error('Not found');
    }

    return entity;
  }

  public async findOneByOrFail(
    criteria: FindOptionsWhere<UserSessionEntity>,
  ): Promise<UserSessionEntity> {
    const entity = await this.findOneBy(criteria);

    if (!entity) {
      throw new Error('Not found');
    }

    return entity;
  }

  public async findByToken(token: string): Promise<UserSessionEntity | null> {
    return await this.findOneBy({ token });
  }

  public async findByTokenOrFail(token: string): Promise<UserSessionEntity> {
    const entity = await this.findByToken(token);

    if (!entity) {
      throw new Error('Not found');
    }

    return entity;
  }

  public async create(
    entity: UserSessionEntity,
    options?: SaveOptions,
  ): Promise<UserSessionEntity> {
    const repository = await this.open();

    return await repository.save(entity, options);
  }

  public async createMany(
    entities: UserSessionEntity[],
    options?: SaveOptions,
  ): Promise<UserSessionEntity[]> {
    const repository = await this.open();

    return await repository.save(entities, options);
  }

  public async update(
    entity: UserSessionEntity,
    options?: SaveOptions,
  ): Promise<UserSessionEntity> {
    return await this.create(entity, options);
  }

  public async updateMany(
    entities: UserSessionEntity[],
    options?: SaveOptions,
  ): Promise<UserSessionEntity[]> {
    return await this.createMany(entities, options);
  }

  public async delete(
    criteria:
      | FindOptionsWhere<UserSessionEntity>
      | FindOptionsWhere<UserSessionEntity>[],
  ): Promise<UpdateResult> {
    const repository = await this.open();

    return await repository.softDelete(criteria);
  }

  public async count(
    criteria?:
      | FindOptionsWhere<UserSessionEntity>
      | FindOptionsWhere<UserSessionEntity>[],
  ): Promise<number> {
    const repository = await this.open();

    return await repository.count({ where: criteria });
  }
}

export const userSessionRepository = new UserSessionRepository();
