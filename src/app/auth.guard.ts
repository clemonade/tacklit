import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {BehaviorSubject, noop, Observable, tap} from 'rxjs';
import {AuthService} from "./auth.service";
import {LOGIN_PATH} from "./app-routing.module";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.authService.getCurrentUser()
      .pipe(
        tap(name => {
          name ? noop() : this.router.navigate([LOGIN_PATH]);
          this.isLoggedIn.next(!!name);
        }))
      .subscribe();

    return this.isLoggedIn;
  }
}
