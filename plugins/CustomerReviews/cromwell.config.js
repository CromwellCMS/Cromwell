module.exports = {
    name: "ProductShowcase",
    type: "plugin",
    buildDir: "dist",
    adminDir: "dist/admin/index.js",
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
        entitiesDir: "src/backend/entities"
    }
}