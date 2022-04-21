import { ApiProperty } from '@nestjs/swagger';
import { TUser, TRole } from '@cromwell/core';

export class UserDto implements TUser {
    @ApiProperty()
    id: number;

    @ApiProperty()
    fullName?: string | null;

    @ApiProperty()
    email?: string | null;

    @ApiProperty()
    avatar?: string | null;

    @ApiProperty()
    bio?: string | null;

    @ApiProperty()
    phone?: string | null;

    @ApiProperty()
    address?: string | null;

    @ApiProperty()
    roles?: TRole[] | null;

    parseUser(user: TUser) {
        this.id = user.id;
        this.email = user.email;
        this.avatar = user.avatar;
        this.fullName = user.fullName;
        this.bio = user.bio;
        this.phone = user.phone;
        this.address = user.address;
        this.roles = user.roles?.map(role => ({
            id: role.id,
            name: role.name,
            title: role.title,
            permissions: role.permissions,
        }));
        return this;
    }
}