
export type TMainMenuSettings = {
    items?: TMainMenuItem[];
    mobileBreakpoint?: number;
}

export type TInstanceSettings = {
    mobile?: boolean;
}

export type TMainMenuItem = {
    title: string;
    href?: string;
    html?: string;
    width?: number;
    sublinkCols?: number;
    sublinks?: {
        title?: string;
        href?: string;
    }[]
}