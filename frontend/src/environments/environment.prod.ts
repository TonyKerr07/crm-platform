// src/environments/environment.prod.ts
// Usado quando você roda: ng build --configuration production
// As URLs são substituídas em tempo de build pelo nginx/docker
export const environment = {
  production: true,
  apiUrl: '/api',                          // Nginx faz proxy para o backend
  keycloakUrl: window.location.origin.replace(':4200', ':8180'),
  keycloakRealm: 'crm-realm',
  keycloakClientId: 'crm-frontend',
};
