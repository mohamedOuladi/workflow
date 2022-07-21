import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PluginLibraryComponent } from './components/plugin-library/plugin-library.component';
import { PluginAComponent } from './components/plugin-a/plugin-a.component';
import { PluginDraggableComponent } from './components/plugin-draggable/plugin-draggable.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    PluginLibraryComponent,
    PluginAComponent,
    PluginDraggableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
