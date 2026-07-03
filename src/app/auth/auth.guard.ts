import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * AuthGuard
 * Prevents unauthenticated users from accessing protected routes.
 * Redirects to /login if no valid session is found.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean | UrlTree {
  

    // Not logged in — redirect to login page
    return this.router.createUrlTree(['/login']);
  }
}
