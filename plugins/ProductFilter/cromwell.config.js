module.exports = {
    name: "ProductFilter",
    type: "plugin",
    buildDir: "dist",
    frontendInputFile: "src/frontend/index.tsx",
    backend: {
        resolversDir: "src/backend/resolvers",
        entitiesDir: "src/backend/entities"
    },
    defaultSettings: {
        productListId: "Category_ProductList"
    }
}