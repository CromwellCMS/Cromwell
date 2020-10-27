module.exports = {
    name: "ProductShowcase",
    type: "plugin",
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
        entitiesDir: "src/backend/entities"
    }
}