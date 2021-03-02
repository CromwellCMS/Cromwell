import { logFor, TPagedList, TPagedParams, TUserInput } from '@cromwell/core';
import { EntityRepository } from 'typeorm';

import { User } from '../entities/User';
import { handleBaseInput } from './BaseQueries';
import { BaseRepository } from './BaseRepository';
import { getLogger } from '../helpers/constants';

const logger = getLogger('detailed');

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

    async createUser(createUser: TUserInput): Promise<User> {
        logger.log('UserRepository::createUser');
        let user = new User();

        handleBaseInput(user, createUser);

        user.fullName = createUser.fullName;
        user.email = createUser.email;
        user.avatar = createUser.avatar;
        user.password = createUser.password;

        user = await this.save(user);

        return user;
    }

    async updateUser(id: string, updateUser: TUserInput): Promise<User> {
        logger.log('UserRepository::updateUser id: ' + id);

        let user = await this.findOne({
            where: { id }
        });
        if (!user) throw new Error(`User ${id} not found!`);

        handleBaseInput(user, updateUser);

        user.fullName = updateUser.fullName;
        user.email = updateUser.email;
        user.avatar = updateUser.avatar;
        user.password = updateUser.password;

        user = await this.save(user);

        return user;
    }

    async deleteUser(id: string): Promise<boolean> {
        logger.log('UserRepository::deleteUser; id: ' + id);

        const user = await this.getUserById(id);
        if (!user) {
            console.log('UserRepository::deleteUser failed to find user by id');
            return false;
        }
        const res = await this.delete(id);
        return true;

    }

}