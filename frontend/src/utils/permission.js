export const hasRole = (userRoles, required) => {
    if (!required || required.length === 0) return true;
    if (!userRoles || userRoles.length === 0) return false;

    if (Array.isArray(required)) {
        return required.some((r) => userRoles.includes(r));
    }

    return userRoles.includes(required);
};
