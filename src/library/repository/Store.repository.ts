import { FindManyOptions, IsNull } from 'typeorm';
import { IListParams } from '../../common/models/BaseController';
import { BaseRepository } from '../../common/models/BaseRepository';
import { TObject } from '../../common/models/TObject';
import { EnumRoles } from '../../common/models/enum/EnumRoles';
import { Store } from '../entity';

export class StoreRepository extends BaseRepository(Store) {
    /**
     * findStoreByCnpj
     *
     * @param { string } cnpj
     * @returns { Promise<Store | null> }
     */
    public async findStoreByCnpj(cnpj: string): Promise<Store | null> {
        return this.repository.findOne({ where: { cnpj } });
    }

    /**
     * findStoreById
     *
     * @param { string } id
     * @returns { Promise<Store | null> }
     */
    public async findStoreById(authentication: TObject, id: string): Promise<Store | null> {
        let where: TObject = { id };

        if (authentication.role !== EnumRoles.ADMIN) {
            where = { id, deletedAt: IsNull() };
        }

        return this.repository.findOne({ where });
    }

    /**
     * findStores
     *
     * @param { IListParams } params
     * @returns { Promise<Store[]> }
     */
    public async findStores(authentication: TObject, params: IListParams, withDeleted: boolean = true): Promise<[Store[], number]> {
        const skip = params.size * (params.page - 1);
        const take = params.size;
        let where: TObject = {};

        const options: FindManyOptions<Store> = { skip, take };

        if (params.order) {
            options.order = { [params.order]: params.orderBy };
        }

        if (authentication.role !== EnumRoles.ADMIN || !withDeleted) {
            where = { owner: { id: authentication?.userId }, deletedAt: IsNull() };
        }

        options.where = where;

        return this.repository.findAndCount(options);
    }
}
