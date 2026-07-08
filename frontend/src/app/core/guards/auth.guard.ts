import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

/**
 * Guard de autenticação.
 * Se o usuário NÃO estiver logado → redireciona para o Keycloak.
 *
 * Como usar na rota:
 *   canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = async () => {
  const keycloak = inject(KeycloakService);

  if (keycloak.isLoggedIn()) {
    return true;
  }

  // Redireciona para login do Keycloak e volta para a URL atual após login
  await keycloak.login({ redirectUri: window.location.href });
  return false;
};
