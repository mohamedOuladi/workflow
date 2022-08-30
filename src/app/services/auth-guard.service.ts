import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@labshare/base-ui-services';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkUser();
  }

  canLoad(route: ActivatedRouteSnapshot) {
    return this.checkUser();
  }

  private async checkUser() {
    await this.authService.onAuthCallback();
    return firstValueFrom(
      this.authService.isAuthorized.pipe(
        map((isAuthorized: boolean) => {
          if (!isAuthorized) {
            this.authService.login();
          }
          return isAuthorized;
        })
      )
    );
  }
}
