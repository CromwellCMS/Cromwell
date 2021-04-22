export const validateEmail = (email) => {
    if (/\S+@\S+\.\S+/.test(email)) {
        return true;
    } else {
        return false;
    }
}