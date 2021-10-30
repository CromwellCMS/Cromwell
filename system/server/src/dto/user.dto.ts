import { ApiProperty } from '@nestjs/swagger';
import { TUser, TUserRole } from '@cromwell/core';

export class UserDto implements TUser {
    @ApiProperty()
    id: number;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    avatar?: string;

    @ApiProperty()
    bio?: string;

    @ApiProperty()
    phone?: string;

    @ApiProperty()
    address?: string;

    @ApiProperty()
    role?: TUserRole;

    parseUser(user: TUser) {
        this.id = user.id;
        this.email = user.email;
        this.avatar = user.avatar;
        this.fullName = user.fullName;
        this.bio = user.bio;
        this.phone = user.phone;
        this.address = user.address;
        this.role = user.role;
        return this;
    }
}
