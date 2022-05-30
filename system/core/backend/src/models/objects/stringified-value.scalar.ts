import { GraphQLScalarType, Kind } from "graphql";

const parseStringifiedValue = (value: string | number | boolean | Date): string | number | boolean | Date | null | undefined => {
    if (typeof value === 'number' || typeof value === 'boolean') return value;
    if (value === null) return null;
    if (value === undefined) return undefined;
    if (value === 'false') return false;
    if (value === 'true') return true;
    if (value === 'null') return null;
    if (value === 'undefined') return undefined;
    const num = Number(value);
    if (!isNaN(num)) return num;

    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;

    return value;
}

export const StringifiedValueScalar = new GraphQLScalarType({
    name: "StringifiedValueScalar",
    description: "A value any of string, number, boolean, Date type",
    parseValue(value: string) {
        return parseStringifiedValue(value);
    },
    serialize(value: string | number | boolean | Date) {
        return String(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT || ast.kind === Kind.BOOLEAN) {
            return parseStringifiedValue(ast.value);
        }
        return null;
    },
});
