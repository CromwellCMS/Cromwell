import { TCreateUser, TDeleteManyInput, TPagedList, TPagedParams, TUpdateUser, TUser } from '@cromwell/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import bcrypt from '@node-rs/bcrypt';
import { Brackets, EntityRepository, getCustomRepository, SelectQueryBuilder } from 'typeorm';

import { bcryptSaltRounds } from '../helpers/auth-settings';
import { checkEntitySlug, getPaged, handleBaseInput, handleCustomMetaInput } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { validateEmail } from '../helpers/validation';
import { User } from '../models/entities/user.entity';
import { UserFilterInput } from '../models/filters/user.filter';
import { PagedParamsInput } from '../models/inputs/paged-params.input';
import { BaseRepository } from './base.repository';
import { RoleRepository } from './role.repository';

const logger = getLogger();

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {

    constructor() {
        super(User)
    }

    async getUsers(params?: TPagedParams<User>): Promise<TPagedList<User>> {
        logger.log('UserRepository::getUsers');
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.leftJoinAndSelect(`${this.metadata.tablePath}.roles`,
            getCustomRepository(RoleRepository).metadata.tablePath);
        return await getPaged(qb, this.metadata.tablePath, params);
    }

    async getUserById(id: number): Promise<User | undefined> {
        logger.log('UserRepository::getUserById id: ' + id);
        return this.getById(id, ['roles']);
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        logger.log('UserRepository::getUserByEmail email: ' + email);

        const user = await this.findOne({
            where: { email },
            relations: ['roles'],
        });
        return user;
    }

    async getUserBySlug(slug: string): Promise<User | undefined> {
        logger.log('UserRepository::getUserBySlug slug: ' + slug);
        return this.getBySlug(slug, ['roles']);
    }

    async handleUserInput(user: User, userInput: TUpdateUser, action: 'update' | 'create') {
        if (!validateEmail(userInput.email))
            throw new HttpException('Provided e-mail is not valid', HttpStatus.BAD_REQUEST);

        const matches = await this.find({
            where: {
                email: userInput.email,
            }
        });
        for (const match of matches) {
            if (match?.id !== user.id) {
                throw new HttpException('Email is already taken', HttpStatus.BAD_REQUEST);
            }
        }

        await handleBaseInput(user, userInput);
        user.fullName = userInput.fullName;
        user.email = userInput.email;
        user.avatar = userInput.avatar;
        user.bio = userInput.bio;
        user.phone = userInput.phone;
        user.address = userInput.address;
        if (userInput.roles !== undefined) {
            user.roles = [];
            for (const role of (userInput.roles ?? [])) {
                const dbRole = await getCustomRepository(RoleRepository).getRoleByName(role);
                if (dbRole) {
                    if (!user.roles) user.roles = [];
                    user.roles.push(dbRole)
                }
            }
        }

        if (action === 'create') await user.save();
        await checkEntitySlug(user, User);
        await handleCustomMetaInput(user, userInput);
    }

    async createUser(createUser: TCreateUser, id?: number | null,
        passwordType?: 'hash' | 'plain'): Promise<User> {
        logger.log('UserRepository::createUser');
        if (!createUser.password || !createUser.email)
            throw new HttpException('No credentials provided', HttpStatus.BAD_REQUEST);

        if (passwordType !== 'hash' && createUser.password.length > 50)
            throw new HttpException('Password length is too long', HttpStatus.BAD_REQUEST);

        const user = new User();
        if (id) {
            let oldUser;
            try {
                oldUser = await this.getUserById(id);
            } catch (error) { }
            if (oldUser) throw new HttpException('User already exists for provided id: ' + id, HttpStatus.BAD_REQUEST);
            user.id = id;
        }

        if (createUser.password) {
            if (passwordType !== 'hash') {
                createUser.password = await this.hashPassword(createUser.password);
            }
            user.password = createUser.password;
        }

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

    async applyUserFilter(qb: SelectQueryBuilder<TUser>, filterParams?: UserFilterInput) {
        this.applyBaseFilter(qb, filterParams);

        const roleTable = getCustomRepository(RoleRepository).metadata.tablePath;
        qb.leftJoinAndSelect(`${this.metadata.tablePath}.roles`, roleTable);
        // Search by role

        if (filterParams?.roles?.length) {
            const brackets = new Brackets(subQb => {
                filterParams?.roles?.forEach(role => {
                    const query = `${roleTable}.name = :role_${role}`;
                    subQb.orWhere(query, { [`role_${role}`]: role });
                })
            });
            qb.andWhere(brackets);
        }

        if (filterParams?.permissions) {
            const roles = await getCustomRepository(RoleRepository).getAll();
            const rolesToSearch = roles.filter(r => r.permissions?.some(p => filterParams.permissions?.includes(p)));

            const brackets = new Brackets(subQb => {
                rolesToSearch.forEach(role => {
                    const query = `${roleTable}.name = :role_${role.name}`;
                    subQb.orWhere(query, { [`role_${role.name}`]: role.name });
                })
            });
            qb.andWhere(brackets);
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
        await this.applyUserFilter(qb, filterParams);
        if (pagedParams?.orderBy === 'roles') {
            qb.orderBy(`${getCustomRepository(RoleRepository).metadata.tablePath}.title`, pagedParams.order ?? 'DESC');
        }
        return await getPaged<TUser>(qb, this.metadata.tablePath, pagedParams);
    }

    async deleteManyFilteredUsers(input: TDeleteManyInput, filterParams?: UserFilterInput): Promise<boolean | undefined> {
        const qbSelect = this.createQueryBuilder(this.metadata.tablePath).select([`${this.metadata.tablePath}.id`]);
        await this.applyUserFilter(qbSelect, filterParams);
        this.applyDeleteMany(qbSelect, input);

        const qbDelete = this.createQueryBuilder(this.metadata.tablePath).delete()
            .where(`${this.metadata.tablePath}.id IN (${qbSelect.getQuery()})`)
            .setParameters(qbSelect.getParameters());

        await qbDelete.execute();
        return true;
    }
}