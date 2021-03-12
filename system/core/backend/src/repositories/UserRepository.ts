import { logFor, TPagedList, TPagedParams, TUpdateUser, TCreateUser } from '@cromwell/core';
import { EntityRepository } from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from '../entities/User';
import { handleBaseInput, checkEntitySlug } from './BaseQueries';
import { BaseRepository } from './BaseRepository';
import { getLogger } from '../helpers/constants';

const logger = getLogger('detailed');
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
        handleBaseInput(user, userInput);
        user.fullName = userInput.fullName;
        user.email = userInput.email;
        user.avatar = userInput.avatar;
    }

    async createUser(createUser: TCreateUser): Promise<User> {
        logger.log('UserRepository::createUser');
        let user = new User();

        await this.handleUserInput(user, createUser);

        if (createUser.password) {
            const hashedPass = await bcrypt.hash(createUser.password, bcryptSaltRounds);
            user.password = hashedPass;
        }

        if (createUser.role) {
            user.role = createUser.role;
        }

        user = await this.save(user);
        await checkEntitySlug(user);

        return user;
    }

    async updateUser(id: string, updateUser: TUpdateUser): Promise<User> {
        logger.log('UserRepository::updateUser id: ' + id);

        let user = await this.findOne({
            where: { id }
        });
        if (!user) throw new Error(`User ${id} not found!`);

        await this.handleUserInput(user, updateUser);

        user = await this.save(user);
        await checkEntitySlug(user);

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