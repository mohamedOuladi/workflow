import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PluginLibraryComponent } from './components/plugin-library/plugin-library.component';
import { PluginAComponent } from './components/plugin-a/plugin-a.component';
import { DynamicNodeComponent } from './components/node/node.component';
import { PluginBComponent } from './components/plugin-b/plugin-b.component';
import { LinkComponent } from './components/link/link.component';
import { WorkbenchComponent } from './components/workbench/workbench.component';
import { PluginCComponent } from './components/plugin-c/plugin-c.component';
import { PluginDComponent } from './components/plugin-d/plugin-d.component';
import { PluginEComponent } from './components/plugin-e/plugin-e.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RightPanelComponent } from './components/right-panel/right-panel.component';
import { TopControlsComponent } from './components/top-controls/top-controls.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebAuthModule } from '@labshare/base-ui-services';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    PluginLibraryComponent,
    PluginAComponent,
    DynamicNodeComponent,
    PluginBComponent,
    LinkComponent,
    WorkbenchComponent,
    PluginCComponent,
    PluginDComponent,
    PluginEComponent,
    RightPanelComponent,
    TopControlsComponent,
  ],
  imports: [
    WebAuthModule,
    BrowserModule, 
    AppRoutingModule, 
    BrowserAnimationsModule,
    ReactiveFormsModule, 
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
