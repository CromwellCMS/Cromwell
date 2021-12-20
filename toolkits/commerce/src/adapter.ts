import React, { useContext } from 'react';
import { TPaginationProps } from '@cromwell/core-frontend';

export type AdapterContentType = {
    Pagination: React.ComponentType<TPaginationProps>;
    Rating: React.ComponentType<{
        disabled?: boolean;
        icon?: React.ReactNode;
        name?: string;
        max?: number;
        onChange?: (event: React.SyntheticEvent, value: number | null) => void;
        precision?: number;
        readOnly?: boolean;
        size?: 'small' | 'medium' | 'large';
        value?: number | null;
        className?: string;
        style?: React.CSSProperties;
    }>;
    Alert: React.ComponentType<{
        severity?: 'success' | 'info' | 'warning' | 'error';
        className?: string;
        style?: React.CSSProperties;
    }>;
    Button: React.ComponentType<{
        disabled?: boolean;
        className?: string;
        style?: React.CSSProperties;
        onClick: React.MouseEventHandler | undefined;
        variant?: 'outlined' | 'text' | 'contained';
        color?: 'primary';
        size?: 'small' | 'medium' | 'large';
    }>;
    TextField: React.ComponentType<{
        disabled?: boolean;
        error?: boolean;
        fullWidth?: boolean;
        helperText?: React.ReactNode;
        id?: string;
        label?: React.ReactNode;
        multiline?: boolean;
        placeholder?: string;
        rows?: string | number;
        maxRows?: string | number;
        minRows?: string | number;
        value?: unknown;
        size?: 'small' | 'medium';
        onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
        variant?: 'outlined' | 'filled' | 'standard';
        className?: string;
        style?: React.CSSProperties;
    }>;
    Tooltip: React.ComponentType<{
        open?: boolean;
        onOpen?: (event: React.SyntheticEvent) => void;
        enterDelay?: number;
        id?: string;
        leaveDelay?: number;
        onClose?: (event: React.SyntheticEvent | Event) => void;
        title: NonNullable<React.ReactNode>;
        className?: string;
        style?: React.CSSProperties;
        arrow?: boolean;
    }>;
}

const DefaultAdapterContent: AdapterContentType = {
    Pagination: (props) => React.createElement('div', { ...props }),
    Rating: (props) => React.createElement('p', { ...props }, props.value),
    Button: (props) => React.createElement('button', { ...props }),
    Alert: (props) => React.createElement('div', { ...props }),
    TextField: (props) => React.createElement('input', { ...props }),
    Tooltip: (props) => React.createElement(React.Fragment, { ...props }),
}

export type AdapterType = () => AdapterContentType;

export const AdapterContext = React.createContext<AdapterType | null>(null);

export const useAdapter = (): AdapterContentType => {
    const adapter = useContext(AdapterContext);
    return Object.assign({}, DefaultAdapterContent, adapter?.());
}

export const withAdapter = <T>(Component: T, adapter: AdapterType): T => {
    return ((props) => {
        return React.createElement(AdapterContext.Provider, {
            value: adapter,
        }, React.createElement(Component as any, props))
    }) as any;
}