import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

/**
 * Interceptor HTTP que adiciona o token JWT (Bearer) em TODAS as requisições à API.
 *
 * Sem isso, o backend retornaria 401 em toda requisição.
 * Com isso, o Angular coloca automaticamente: Authorization: Bearer <token>
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);

  // Não adiciona token em requisições externas (ex.: OpenAI direta, CDN, etc.)
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  return from(keycloak.getToken()).pipe(
    switchMap(token => {
      if (token) {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
