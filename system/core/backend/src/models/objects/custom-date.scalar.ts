import { GraphQLScalarType, Kind } from "graphql";

export const CustomDateScalar = new GraphQLScalarType({
    name: "CustomDateScalar",
    description: "Custom implementation of Date scalar",
    parseValue(value: string) {
        try {
            return new Date(value);
        } catch (error) { }
        return null;
    },
    serialize(value: Date) {
        try {
            return value.toISOString()
        } catch (e) { }
        return null;
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10));
        }
        return null;
    },
});
