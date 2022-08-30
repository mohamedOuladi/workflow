import { Component } from '@angular/core';
import { AuthService } from '@labshare/base-ui-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private onAuthorizationResult;
  title = 'workflow';

  constructor(private authService: AuthService) {
    this.onAuthorizationResult = this.authService.onAuthorizationResult;
  }

  async ngOnInit():  Promise<void> {
    await this.authService.onAuthCallback();
    this.onAuthorizationResult.subscribe((result: any) => {
      if (result?.authorizationState !== 'authorized') {
        // this.authService.login();
      } 
    });
  }
}
