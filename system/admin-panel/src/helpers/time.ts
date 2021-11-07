
export const toLocaleDateTimeString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export const toLocaleDateString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString();
}

export const toLocaleTimeString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleTimeString();
}