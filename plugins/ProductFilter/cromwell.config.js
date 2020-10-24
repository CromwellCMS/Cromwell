module.exports = {
    "name": "ProductFilter",
    "type": "plugin",
    "buildDir": "dist",
    "frontendInputFile": "src/frontend/index.tsx",
    "backend": {
        "resolversDir": "dist/backend/resolvers",
        "entitiesDir": "dist/backend/entities"
    },
    "defaultSettings": {
        "productListId": "Category_ProductList"
    }
}