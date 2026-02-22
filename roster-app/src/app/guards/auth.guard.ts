import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.getInfo().pipe(
    map(() => {
      auth.setLoggedIn(true);
      return true;
    }),
    catchError(() => {
      auth.setLoggedIn(false);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
