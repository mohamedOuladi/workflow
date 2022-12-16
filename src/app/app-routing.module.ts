import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebAuthModule } from '@labshare/base-ui-services';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'workbench',
    component: LayoutComponent,
    // canActivate: [AuthGuardService],
  },
  {
    path: 'home',
    component: HomeComponent
  },
  { 
    path: '', 
    redirectTo: '/workbench', 
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), WebAuthModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
