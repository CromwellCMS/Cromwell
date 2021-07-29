import { TCreateUser, TDeleteManyInput, TPagedList, TPagedParams, TUpdateUser, TUser } from '@cromwell/core';
import bcrypt from 'bcrypt';
import { DeleteQueryBuilder, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { UserFilterInput } from '../models/filter/user.filter';
import { User } from '../models/entities/user.entity';
import { getLogger } from '../helpers/logger';
import { validateEmail } from '../helpers/validation';
import { PagedParamsInput } from '../models/inputs/paged-params.input';
import { checkEntitySlug, getPaged, handleBaseInput } from '../helpers/base-queries';
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

    async getUserById(id: string): Promise<User | undefined> {
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

    async handleUserInput(user: User, userInput: TUpdateUser) {
        if (userInput.email && !validateEmail(userInput.email))
            throw new Error('Provided e-mail is not valid');

        handleBaseInput(user, userInput);
        user.fullName = userInput.fullName;
        user.email = userInput.email;
        user.avatar = userInput.avatar;
        user.bio = userInput.bio;
        user.phone = userInput.phone;
        user.address = userInput.address;
        user.role = userInput.role;
    }

    async createUser(createUser: TCreateUser, id?: string): Promise<User> {
        logger.log('UserRepository::createUser');
        if (!createUser.password || !createUser.email) throw new Error('No credentials provided')
        let user = new User();
        if (id) {
            let oldUser;
            try {
                oldUser = await this.getUserById(id);
            } catch (error) { }
            if (oldUser) throw new Error('User already exists for provided id: ' + id);
            user.id = id;
        }

        await this.handleUserInput(user, createUser);

        if (createUser.password) {
            user.password = await this.hashPassword(createUser.password);
        }
        if (!user.role) user.role = 'customer';

        user = await this.save(user);
        await checkEntitySlug(user, User);

        return user;
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, bcryptSaltRounds);
    }

    async updateUser(id: string, updateUser: TUpdateUser): Promise<User> {
        logger.log('UserRepository::updateUser id: ' + id);

        let user = await this.findOne({
            where: { id }
        });
        if (!user) throw new Error(`User ${id} not found!`);

        await this.handleUserInput(user, updateUser);

        user = await this.save(user);
        await checkEntitySlug(user, User);

        return user;
    }

    async deleteUser(id: string): Promise<boolean> {
        logger.log('UserRepository::deleteUser; id: ' + id);

        const user = await this.getUserById(id);
        if (!user) {
            logger.error('UserRepository::deleteUser failed to find user by id');
            return false;
        }
        const res = await this.delete(id);
        return true;

    }

    applyUserFilter(qb: SelectQueryBuilder<TUser> | DeleteQueryBuilder<TUser>, filterParams?: UserFilterInput) {
        // Search by role
        if (filterParams?.role) {
            const query = `${this.metadata.tablePath}.role = :role`;
            qb.andWhere(query, { role: filterParams.role });
        }

        // Search by fullName
        if (filterParams?.fullName && filterParams.fullName !== '') {
            const fullNameSearch = `%${filterParams.fullName}%`;
            const query = `${this.metadata.tablePath}.fullName LIKE :fullNameSearch`;
            qb.andWhere(query, { fullNameSearch });
        }

        // Search by email
        if (filterParams?.email && filterParams.email !== '') {
            const emailSearch = `%${filterParams.email}%`;
            const query = `${this.metadata.tablePath}.email LIKE :emailSearch`;
            qb.andWhere(query, { emailSearch });
        }

        // Search by phone
        if (filterParams?.phone && filterParams.phone !== '') {
            const phoneSearch = `%${filterParams.phone}%`;
            const query = `${this.metadata.tablePath}.phone LIKE :phoneSearch`;
            qb.andWhere(query, { phoneSearch });
        }

        // Search by address
        if (filterParams?.address && filterParams.address !== '') {
            const addressSearch = `%${filterParams.address}%`;
            const query = `${this.metadata.tablePath}.address LIKE :addressSearch`;
            qb.andWhere(query, { addressSearch });
        }
    }

    async getFilteredUsers(pagedParams?: PagedParamsInput<TUser>, filterParams?: UserFilterInput): Promise<TPagedList<TUser>> {
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select();
        this.applyUserFilter(qb, filterParams);
        return await getPaged(qb, this.metadata.tablePath, pagedParams);
    }

    async deleteManyFilteredUsers(input: TDeleteManyInput, filterParams?: UserFilterInput): Promise<boolean | undefined> {
        const qb = this.createQueryBuilder()
            .delete().from<User>(this.metadata.tablePath);

        this.applyUserFilter(qb, filterParams);
        this.applyDeleteMany(qb, input);
        try {
            await qb.execute();
        } catch (e) {
            logger.error(e)
        }
        return true;
    }


}