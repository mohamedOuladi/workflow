import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SessionStorageService, WindowService } from '@labshare/base-ui-services';
import { distinct } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'workflow';
  public route: string;

  constructor(
    private authService: AuthService,
    public sessionStorageService: SessionStorageService,
    public windowService: WindowService,
    private router: Router) {
    this.route = this.getRedirectUrl();
  }

  async ngOnInit():  Promise<void> {
    await this.authService.onAuthCallback();
    /* Performing authorization with labshare auth*/
    this.authService
      .isAuthorized()
      .pipe(distinct())
      .subscribe(val => {
        if (!val) {
          this.sessionStorageService.setItem('route.after.login', this.route);
          this.authService.login();
        } else if (val === true) {
          console.log(this.authService.getAccessToken());
          const routeAfterLogin = this.sessionStorageService.getItem('route.after.login');
          this.sessionStorageService.setItem('route.after.login', '');
          const route = this.getRedirectUrl();
          console.log('route: ' + route);
          if (routeAfterLogin && routeAfterLogin !== route) {
            this.router.navigate([routeAfterLogin]);
          } 
        }
      });
  }

  /* Get main route */
  getRedirectUrl() {
    let afterLoginRoute: string;
    afterLoginRoute = this.windowService.nativeWindow.location.href.replace(
      this.windowService.nativeWindow.location.origin,
      ''
    );
    afterLoginRoute =
      afterLoginRoute.lastIndexOf('/') === afterLoginRoute.length - 1
        ? afterLoginRoute.slice(0, afterLoginRoute.length - 1)
        : afterLoginRoute;

    if (!afterLoginRoute) {
      return '';
    }
    if (afterLoginRoute.indexOf('/?code=') > -1 || afterLoginRoute.indexOf('?error=') > -1) {
      return '';
    }
    return afterLoginRoute;
  }
}
