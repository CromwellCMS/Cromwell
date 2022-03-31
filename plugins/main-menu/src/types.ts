
export type TMainMenuSettings = {
    items?: TMainMenuItem[];
    mobileBreakpoint?: number;
}

export type TInstanceSettings = {
    mobile?: boolean;
    elements?: {
        MenuItem?: React.ComponentType;
        IconButton?: React.ComponentType<{ onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void }>;
        Popover?: React.ComponentType<{ id: string; open: boolean; anchorEl?: HTMLElement | null }>;
    }
}

export type TMainMenuItem = {
    title: string;
    id: string;
    href?: string;
    html?: string;
    width?: number;
    sublinkCols?: number;
    sublinks?: {
        title?: string;
        href?: string;
    }[]
}