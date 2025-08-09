import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Permitir si ya está logueado
  if (auth.isLoggedIn()) return true;

  // Si es ruta de orden o login, permitir
  if (state.url.startsWith('/orden/') || state.url === '/login') return true;

  // En otro caso, redirigir a login
  router.navigate(['/login']);
  return false;
};
