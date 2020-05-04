export interface ComponentProps<Data> {
    data: Data
}

export type PageName = keyof {
    index,
    product,
    blog
}