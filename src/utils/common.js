export const getUserRole = (user) => {
  if (user.isSuperAdmin) {
    return "Super Admin";
  } else if (user.isAdmin) {
    return "Admin";
  } else if (user.isSuperUser) {
    return "Super User";
  } else {
    return "User";
  }
};
