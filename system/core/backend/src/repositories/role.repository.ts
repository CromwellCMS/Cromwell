import { TDeleteManyInput, TPagedList, TPagedParams, TRole, TRoleInput } from '@cromwell/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

import { onRolesChange } from '../helpers/auth-roles-permissions';
import { getPaged } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { Role } from '../models/entities/role.entity';
import { BaseFilterInput } from '../models/filters/base-filter.filter';
import { PagedParamsInput } from '../models/inputs/paged-params.input';
import { BaseRepository } from './base.repository';

const logger = getLogger();

@EntityRepository(Role)
export class RoleRepository extends BaseRepository<Role> {

    constructor() {
        super(Role);
    }

    async getRoles(params?: TPagedParams<TRole>): Promise<TPagedList<Role>> {
        logger.log('RoleRepository::getRoles');
        return this.getPaged(params);
    }

    async getRoleById(id: number): Promise<Role | undefined> {
        logger.log('RoleRepository::getRoleById id: ' + id);
        return this.getById(id);
    }

    async getRoleByName(name: string): Promise<Role | undefined> {
        logger.log('RoleRepository::getRoleByName name: ' + name);
        const entity = await this.findOne({
            where: { name }
        });

        if (!entity) throw new HttpException(`Role ${name} not found!`, HttpStatus.NOT_FOUND);
        return entity;
    }

    async getRolesByIds(ids: number[]): Promise<Role[]> {
        logger.log('RoleRepository::getRolesByIds ids: ' + ids.join(', '));
        return this.findByIds(ids);
    }

    private async handleBaseRoleInput(role: Role, input: TRoleInput, action: 'update' | 'create') {
        role.name = input.name;
        role.title = input.title;
        role.permissions = input.permissions;
    }

    async createRole(inputData: TRoleInput, id?: number | null): Promise<Role> {
        logger.log('RoleRepository::createRole');
        const role = new Role();
        if (id) role.id = id;

        await this.handleBaseRoleInput(role, inputData, 'create');
        await this.save(role);
        await onRolesChange();
        return role;
    }

    async updateRole(id: number, inputData: TRoleInput): Promise<Role> {
        logger.log('RoleRepository::updateRole id: ' + id);
        const role = await this.getById(id);

        await this.handleBaseRoleInput(role, inputData, 'update');
        await this.save(role);
        await onRolesChange();
        return role;
    }

    async deleteRole(id: number): Promise<boolean> {
        logger.log('RoleRepository::deleteRole; id: ' + id);

        const role = await this.getRoleById(id);
        if (!role) {
            logger.error('RoleRepository::deleteRole failed to find Role by id');
            return false;
        }
        const res = await this.delete(id);
        await onRolesChange();
        return true;
    }

    applyRoleFilter(qb: SelectQueryBuilder<Role>, filterParams?: BaseFilterInput) {
        this.applyBaseFilter(qb, filterParams)
        return qb;
    }

    async getFilteredRoles(pagedParams?: PagedParamsInput<Role>, filterParams?: BaseFilterInput): Promise<TPagedList<Role>> {
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select();
        this.applyRoleFilter(qb, filterParams);
        return await getPaged<Role>(qb, this.metadata.tablePath, pagedParams);
    }

    async deleteManyFilteredRoles(input: TDeleteManyInput, filterParams?: BaseFilterInput): Promise<boolean | undefined> {
        const qbSelect = this.createQueryBuilder(this.metadata.tablePath).select([`${this.metadata.tablePath}.id`]);
        this.applyRoleFilter(qbSelect, filterParams);
        this.applyDeleteMany(qbSelect, input);

        const qbDelete = this.createQueryBuilder(this.metadata.tablePath).delete()
            .where(`${this.metadata.tablePath}.id IN (${qbSelect.getQuery()})`)
            .setParameters(qbSelect.getParameters());

        await qbDelete.execute();
        await onRolesChange();
        return true;
    }
}
