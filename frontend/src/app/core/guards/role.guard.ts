import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

/**
 * Guard de papel (role).
 * Verifica se o usuário tem a role necessária para acessar a rota.
 *
 * Como usar na rota:
 *   canActivate: [authGuard, roleGuard],
 *   data: { roles: ['EMPRESA'] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);
  const requiredRoles: string[] = route.data['roles'] ?? [];

  if (requiredRoles.length === 0) return true;

  const hasRole = requiredRoles.some(role => keycloak.isUserInRole(role));
  if (!hasRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
