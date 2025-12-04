import type {
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { UserAccountEntity } from '../entities/UserAccountEntity';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '../shared/database/PrimaryDatabase';

export class UserAccountRepository {
  private readonly database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }

  public async open(): Promise<Repository<UserAccountEntity>> {
    return await this.database.open(UserAccountEntity);
  }

  public async close(): Promise<void> {
    await this.database.close();
  }

  public async find(
    criteria: FindManyOptions<UserAccountEntity>,
  ): Promise<UserAccountEntity[] | null> {
    const repository = await this.open();

    return await repository.find(criteria);
  }

  public async findOne(id: string): Promise<UserAccountEntity | null> {
    const repository = await this.open();

    return await repository.findOne({
      relations: {
        user: true,
      },
      where: { id },
    });
  }

  public async findOneBy(
    criteria: FindOptionsWhere<UserAccountEntity>,
  ): Promise<UserAccountEntity | null> {
    const repository = await this.open();

    return await repository.findOne({
      relations: {
        user: true,
      },
      where: criteria,
    });
  }

  public async findOneOrFail(id: string): Promise<UserAccountEntity> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new Error('Not found');
    }

    return entity;
  }

  public async findOneByOrFail(
    criteria: FindOptionsWhere<UserAccountEntity>,
  ): Promise<UserAccountEntity> {
    const entity = await this.findOneBy(criteria);

    if (!entity) {
      throw new Error('Not found');
    }

    return entity;
  }

  public async create(
    entity: UserAccountEntity,
    options?: SaveOptions,
  ): Promise<UserAccountEntity> {
    const repository = await this.open();

    return await repository.save(entity, options);
  }

  public async createMany(
    entities: UserAccountEntity[],
    options?: SaveOptions,
  ): Promise<UserAccountEntity[]> {
    const repository = await this.open();

    return await repository.save(entities, options);
  }

  public async update(
    entity: UserAccountEntity,
    options?: SaveOptions,
  ): Promise<UserAccountEntity> {
    return await this.create(entity, options);
  }

  public async updateMany(
    entities: UserAccountEntity[],
    options?: SaveOptions,
  ): Promise<UserAccountEntity[]> {
    return await this.createMany(entities, options);
  }

  public async delete(
    criteria:
      | FindOptionsWhere<UserAccountEntity>
      | FindOptionsWhere<UserAccountEntity>[],
  ): Promise<UpdateResult> {
    const repository = await this.open();

    return await repository.softDelete(criteria);
  }

  public async count(
    criteria?:
      | FindOptionsWhere<UserAccountEntity>
      | FindOptionsWhere<UserAccountEntity>[],
  ): Promise<number> {
    const repository = await this.open();

    return await repository.count({ where: criteria });
  }
}
