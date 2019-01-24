import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SettingsService,
  MenubarService,
  SharedService
} from './service.index';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SettingsService,
    MenubarService,
    SharedService
  ],
  declarations: []
})
export class ServiceModule { }
