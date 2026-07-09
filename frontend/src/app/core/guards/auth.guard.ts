import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loggedIn = sessionStorage.getItem('crm_user');
  if (loggedIn) return true;
  router.navigate(['/login']);
  return false;
};