module.exports = {
    name: "ProductShowcase",
    type: "plugin",
    buildDir: "dist",
    adminDir: "dist/admin",
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
    }
}