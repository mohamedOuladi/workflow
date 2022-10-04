import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PluginLibraryComponent } from './components/plugin-library/plugin-library.component';
import { PluginAComponent } from './components/plugin-a/plugin-a.component';
import { DynamicNodeComponent } from './components/node/node.component';
import { LinkComponent } from './components/link/link.component';
import { WorkbenchComponent } from './components/workbench/workbench.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { TopControlsComponent } from './components/top-controls/top-controls.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor, WebAuthModule } from '@labshare/base-ui-services';
import { AppRoutingModule } from './app-routing.module';
import { PluginNewComponent } from './components/plugin-new/plugin-new.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { PluginNewModule } from './components/plugin-new/plugin-new.module';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { HomeComponent } from './components/home/home.component';
import { WorkflowNewComponent } from './components/workflow-new/workflow-new.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    PluginLibraryComponent,
    PluginAComponent,
    DynamicNodeComponent,
    LinkComponent,
    WorkbenchComponent,
    RightPanelComponent,
    TopControlsComponent,
    LeftPanelComponent,
    HomeComponent,
    WorkflowNewComponent,
    PluginNewComponent,
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    ReactiveFormsModule, 
    FormsModule, 
    HttpClientModule, 
    WebAuthModule, 
    AppRoutingModule, 
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
