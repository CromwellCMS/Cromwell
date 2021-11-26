export const removeUndefined = <T>(obj: T): T => {
    for (const [key, val] of Object.entries(obj)) {
        if (typeof val === 'undefined') delete obj[key];
        if (val !== null && typeof val === 'object' && !Array.isArray(val))
            removeUndefined(val);
    }
    return obj;
}