export type TProductFilter = {
    minPrice?: number;
    maxPrice?: number;
    attributes?: TProductFilterAttribute[];
}
export type TProductFilterAttribute = {
    key: string;
    values: string[];
}
