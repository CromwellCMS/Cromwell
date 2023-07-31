export const validateEmail = (email) => {
  if (!email) return false;
  if (/\S+@\S+\.\S+/.test(email)) {
    return true;
  } else {
    return false;
  }
};
