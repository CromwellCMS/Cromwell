export const jwtConstants = {
    secret: 'secretKey',
};

export const bcryptSaltRounds = 10;

export type TAuthUserInfo = {
    id: string;
    email: string;
}