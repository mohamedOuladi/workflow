import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginNewComponent } from './plugin-new.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PluginNewComponent],
  imports: [BrowserModule, CommonModule, NgbModule, FormsModule],
  bootstrap: [PluginNewComponent],
})
export class PluginNewModule { }
