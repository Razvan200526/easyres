import type {
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { UserVerificationEntity } from '../entities/UserVerificationEntity';
import {
  type PrimaryDatabase,
  primaryDatabase,
} from '../shared/database/PrimaryDatabase';

export class UserVerificationRepository {
  private readonly database: PrimaryDatabase;
  constructor() {
    this.database = primaryDatabase;
  }

  public async open(): Promise<Repository<UserVerificationEntity>> {
    return await this.database.open(UserVerificationEntity);
  }

  public async close(): Promise<void> {
    await this.database.close();
  }

  public async find(
    criteria: FindManyOptions<UserVerificationEntity>,
  ): Promise<UserVerificationEntity[] | null> {
    const repository = await this.open();

    return await repository.find(criteria);
  }

  public async findOne(id: string): Promise<UserVerificationEntity | null> {
    const repository = await this.open();

    return await repository.findOne({
      relations: {
        user: true,
      },
      where: { id },
    });
  }

  public async findOneBy(
    criteria: FindOptionsWhere<UserVerificationEntity>,
  ): Promise<UserVerificationEntity | null> {
    const repository = await this.open();

    return await repository.findOne({
      relations: {
        user: true,
      },
      where: criteria,
    });
  }

  public async findOneOrFail(id: string): Promise<UserVerificationEntity> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new Error('Not found');
    }

    return entity;
  }

  public async findOneByOrFail(
    criteria: FindOptionsWhere<UserVerificationEntity>,
  ): Promise<UserVerificationEntity> {
    const entity = await this.findOneBy(criteria);

    if (!entity) {
      throw new Error('Not found');
    }

    return entity;
  }

  public async findByIdentifier(
    identifier: string,
  ): Promise<UserVerificationEntity | null> {
    return await this.findOneBy({ identifier });
  }

  public async findByIdentifierOrFail(
    identifier: string,
  ): Promise<UserVerificationEntity> {
    const entity = await this.findByIdentifier(identifier);

    if (!entity) {
      throw new Error('Not found');
    }

    return entity;
  }

  public async findByValue(
    value: string,
  ): Promise<UserVerificationEntity | null> {
    return await this.findOneBy({ value });
  }

  public async findByValueOrFail(
    value: string,
  ): Promise<UserVerificationEntity> {
    const entity = await this.findByValue(value);

    if (!entity) {
      throw new Error('Not found');
    }

    return entity;
  }

  public async create(
    entity: UserVerificationEntity,
    options?: SaveOptions,
  ): Promise<UserVerificationEntity> {
    const repository = await this.open();

    return await repository.save(entity, options);
  }

  public async createMany(
    entities: UserVerificationEntity[],
    options?: SaveOptions,
  ): Promise<UserVerificationEntity[]> {
    const repository = await this.open();

    return await repository.save(entities, options);
  }

  public async update(
    entity: UserVerificationEntity,
    options?: SaveOptions,
  ): Promise<UserVerificationEntity> {
    return await this.create(entity, options);
  }

  public async updateMany(
    entities: UserVerificationEntity[],
    options?: SaveOptions,
  ): Promise<UserVerificationEntity[]> {
    return await this.createMany(entities, options);
  }

  public async delete(
    criteria:
      | FindOptionsWhere<UserVerificationEntity>
      | FindOptionsWhere<UserVerificationEntity>[],
  ): Promise<UpdateResult> {
    const repository = await this.open();

    return await repository.softDelete(criteria);
  }

  public async count(
    criteria?:
      | FindOptionsWhere<UserVerificationEntity>
      | FindOptionsWhere<UserVerificationEntity>[],
  ): Promise<number> {
    const repository = await this.open();

    return await repository.count({ where: criteria });
  }
}
