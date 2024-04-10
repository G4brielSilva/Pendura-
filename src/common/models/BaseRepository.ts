/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line max-classes-per-file
import { DeepPartial, EntityTarget, FindManyOptions, FindOptionsOrder, ObjectLiteral, Repository } from 'typeorm';
import { dataSource } from '../../config/database';
import { IListParams } from './BaseController';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const BaseRepository = <T extends ObjectLiteral>(entity: EntityTarget<T>) => {
    class GenericBaseRepository {
        protected repository: Repository<T>;

        constructor() {
            this.repository = dataSource.getRepository(entity);
        }

        public async findById(id: any): Promise<T | null> {
            return this.repository.findOne({ where: { id } });
        }

        public async find(params: IListParams): Promise<[T[], number]> {
            const skip = params.size * (params.page - 1);
            const take = params.size;

            const options: FindManyOptions<T> = { skip, take };

            if (params.order) {
                options.order = { [params.order]: params.orderBy } as FindOptionsOrder<T>;
            }

            return this.repository.findAndCount(options);
        }

        public async create(data: DeepPartial<T>): Promise<T> {
            return this.repository.save(data);
        }

        public async delete(id: any): Promise<void> {
            this.repository.delete(id);
        }

        public async update(id: any, data: DeepPartial<T>): Promise<T> {
            const register = (await this.findById(id)) as T;

            const updatedRegister = this.repository.merge(register, data);

            await this.repository.save(updatedRegister);

            return this.findById(id) as Promise<T>;
        }

        public async softDelete(id: any): Promise<T> {
            const register = (await this.findById(id)) as T & { deletedAt: Date };

            register.deletedAt = new Date() as any;

            return this.repository.save(register);
        }
    }
    return GenericBaseRepository;
};
