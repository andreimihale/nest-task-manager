import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export abstract class BaseRepository {
  constructor(private readonly dataSource: DataSource) {}

  private getEntityManager(entityManager?: EntityManager): EntityManager {
    if (entityManager) {
      return entityManager;
    }

    return this.dataSource.manager;
  }

  // Pass entityManager to run queries inside transactions.
  protected getRepository<T extends ObjectLiteral>(
    entityTarget: EntityTarget<T>,
    entityManager?: EntityManager,
  ): Repository<T> {
    const resolvedEntityManager = this.getEntityManager(entityManager);
    return resolvedEntityManager.getRepository(entityTarget);
  }
}
