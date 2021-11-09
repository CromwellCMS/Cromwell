import { TCreateUser, TDeleteManyInput, TPagedList, TPagedParams, TUpdateUser, TUser } from '@cromwell/core';
import bcrypt from 'bcrypt';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

import { checkEntitySlug, getPaged, handleBaseInput, handleCustomMetaInput } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { validateEmail } from '../helpers/validation';
import { User } from '../models/entities/user.entity';
import { UserFilterInput } from '../models/filters/user.filter';
import { PagedParamsInput } from '../models/inputs/paged-params.input';
import { BaseRepository } from './base.repository';

const logger = getLogger();
const bcryptSaltRounds = 10;

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {

    constructor() {
        super(User)
    }

    async getUsers(params?: TPagedParams<User>): Promise<TPagedList<User>> {
        logger.log('UserRepository::getUsers');
        return this.getPaged(params)
    }

    async getUserById(id: number): Promise<User | undefined> {
        logger.log('UserRepository::getUserById id: ' + id);
        return this.getById(id);
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        logger.log('UserRepository::getUserByEmail email: ' + email);

        const user = await this.findOne({
            where: { email }
        });

        return user;
    }

    async getUserBySlug(slug: string): Promise<User | undefined> {
        logger.log('UserRepository::getUserBySlug slug: ' + slug);
        return this.getBySlug(slug);
    }

    async handleUserInput(user: User, userInput: TUpdateUser, action: 'update' | 'create') {
        if (userInput.email && !validateEmail(userInput.email))
            throw new Error('Provided e-mail is not valid');

        await handleBaseInput(user, userInput);
        user.fullName = userInput.fullName;
        user.email = userInput.email;
        user.avatar = userInput.avatar;
        user.bio = userInput.bio;
        user.phone = userInput.phone;
        user.address = userInput.address;
        user.role = userInput.role;

        if (action === 'create') await user.save();
        await checkEntitySlug(user, User);
        await handleCustomMetaInput(user, userInput);
    }

    async createUser(createUser: TCreateUser, id?: number | null): Promise<User> {
        logger.log('UserRepository::createUser');
        if (!createUser.password || !createUser.email) throw new Error('No credentials provided')
        const user = new User();
        if (id) {
            let oldUser;
            try {
                oldUser = await this.getUserById(id);
            } catch (error) { }
            if (oldUser) throw new Error('User already exists for provided id: ' + id);
            user.id = id;
        }

        if (createUser.password) {
            user.password = await this.hashPassword(createUser.password);
        }
        if (!user.role) user.role = 'customer';

        await this.handleUserInput(user, createUser, 'create');
        await this.save(user);
        return user;
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, bcryptSaltRounds);
    }

    async updateUser(id: number, updateUser: TUpdateUser): Promise<User> {
        logger.log('UserRepository::updateUser id: ' + id);
        const user = await this.getById(id);
        if (!user) throw new Error(`User ${id} not found!`);

        await this.handleUserInput(user, updateUser, 'update');
        await this.save(user);
        return user;
    }

    async deleteUser(id: number): Promise<boolean> {
        logger.log('UserRepository::deleteUser; id: ' + id);

        const user = await this.getUserById(id);
        if (!user) {
            logger.error('UserRepository::deleteUser failed to find user by id');
            return false;
        }
        const res = await this.delete(id);
        return true;

    }

    applyUserFilter(qb: SelectQueryBuilder<TUser>, filterParams?: UserFilterInput) {
        this.applyBaseFilter(qb, filterParams);

        // Search by role
        if (filterParams?.role) {
            const query = `${this.metadata.tablePath}.role = :role`;
            qb.andWhere(query, { role: filterParams.role });
        }

        // Search by fullName
        if (filterParams?.fullName && filterParams.fullName !== '') {
            const fullNameSearch = `%${filterParams.fullName}%`;
            const query = `${this.metadata.tablePath}.${this.quote('fullName')} ${this.getSqlLike()} :fullNameSearch`;
            qb.andWhere(query, { fullNameSearch });
        }

        // Search by email
        if (filterParams?.email && filterParams.email !== '') {
            const emailSearch = `%${filterParams.email}%`;
            const query = `${this.metadata.tablePath}.email ${this.getSqlLike()} :emailSearch`;
            qb.andWhere(query, { emailSearch });
        }

        // Search by phone
        if (filterParams?.phone && filterParams.phone !== '') {
            const phoneSearch = `%${filterParams.phone}%`;
            const query = `${this.metadata.tablePath}.phone ${this.getSqlLike()} :phoneSearch`;
            qb.andWhere(query, { phoneSearch });
        }

        // Search by address
        if (filterParams?.address && filterParams.address !== '') {
            const addressSearch = `%${filterParams.address}%`;
            const query = `${this.metadata.tablePath}.address ${this.getSqlLike()} :addressSearch`;
            qb.andWhere(query, { addressSearch });
        }
    }

    async getFilteredUsers(pagedParams?: PagedParamsInput<TUser>, filterParams?: UserFilterInput): Promise<TPagedList<TUser>> {
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select();
        this.applyUserFilter(qb, filterParams);
        return await getPaged<TUser>(qb, this.metadata.tablePath, pagedParams);
    }

    async deleteManyFilteredUsers(input: TDeleteManyInput, filterParams?: UserFilterInput): Promise<boolean | undefined> {
        const qbSelect = this.createQueryBuilder(this.metadata.tablePath).select([`${this.metadata.tablePath}.id`]);
        this.applyUserFilter(qbSelect, filterParams);
        this.applyDeleteMany(qbSelect, input);

        const qbDelete = this.createQueryBuilder(this.metadata.tablePath).delete()
            .where(`${this.metadata.tablePath}.id IN (${qbSelect.getQuery()})`)
            .setParameters(qbSelect.getParameters());

        await qbDelete.execute();
        return true;
    }
}