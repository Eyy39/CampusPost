export function getRoleRedirectPath(roleId) {
  switch (Number(roleId)) {
    case 2:
      return '/staff';
    case 3:
      return '/system-admin';
    case 1:
    default:
      return '/';
  }
}
