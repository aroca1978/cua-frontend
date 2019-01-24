import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

settings: Settings = {
  themeUrl: 'assets/css/base.css',
  theme: 'base'
};

  constructor() { }

  saveSettings() {
    localStorage.setItem('settings', JSON.stringify( this.settings ));
  }

  loadSettings() {
    if (localStorage.getItem('ajustes')) {
      this.settings = JSON.parse(localStorage.getItem('ajustes'));
    } else {
      console.log('Usando valores por defecto');
    }
  }
}


interface Settings {
  themeUrl: string;
  theme: string;
}
