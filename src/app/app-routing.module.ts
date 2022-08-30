import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebAuthModule } from '@labshare/base-ui-services';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), WebAuthModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
