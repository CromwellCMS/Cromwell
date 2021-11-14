import { GraphQLScalarType, Kind } from "graphql";

const parsePrimitiveValue = (value: string | number | boolean): string | number | boolean | null | undefined => {
    if (typeof value === 'number' || typeof value === 'boolean') return value;
    if (value === null) return null;
    if (value === undefined) return undefined;
    if (value === 'false') return false;
    if (value === 'true') return true;
    if (value === 'null') return null;
    if (value === 'undefined') return undefined;
    const num = Number(value);
    if (!isNaN(num)) return num;
    return value;
}

export const PrimitiveValueScalar = new GraphQLScalarType({
    name: "PrimitiveValueScalar",
    description: "Any primitive value",
    parseValue(value: string) {
        return parsePrimitiveValue(value);
    },
    serialize(value: string | number | boolean) {
        return String(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT || ast.kind === Kind.BOOLEAN) {
            return parsePrimitiveValue(ast.value);
        }
        return null;
    },
});
