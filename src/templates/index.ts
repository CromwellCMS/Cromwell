export const importProductPage = async (templateName: string) => {
    console.log('importProductPage templateName', templateName);
    const everyth = await import(`./${templateName}/`);
    console.log('importProductPage everyth', everyth);

    return everyth.Product;
}
export const importBlogPage = async (templateName: string) => {
    return (await import(`./${templateName}/`)).Blog;
}
export const importIndexPage = async (templateName: string) => {
    return (await import(`./${templateName}/`)).Index;
}


export const importComponentsConfig = async (templateName: string) => {
    return (await import(`./${templateName}/`)).componentsConfig;
}