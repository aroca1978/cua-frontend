import { Component, OnInit } from '@angular/core';
import { CardprocessingComponent } from './cardprocessing/cardprocessing.component';
import { BusinessinfoComponent } from './businessinfo/businessinfo.component';
import { SalesComponent } from './sales/sales.component';
import { PersonalinfoComponent } from './personalinfo/personalinfo.component';
import { ApolloService } from '../services/shared/apollo.service';
import { Application } from '../interfaces/application.interface';
import { Observable, timer } from 'rxjs';


declare function init_plugins(); // esto lo hago para poder acceder a la función externa que declaré fuera de angular en assets/js/custom.js

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})

export class ApplyComponent implements OnInit {

  isOkToRun = false;

  constructor( public _as: ApolloService ) {
    this.isOkToRun = _as.checkLocalStorageVars();
    const thetimer = timer(3000000, 3000000);
    thetimer.subscribe(
      val => {
        console.log('Renewing partner token');
        _as.getPartnerToken();
      },
      error => {
        console.log('Cannot refresh partner token', error);
      }
    );

    if (this.isOkToRun) {
      _as.application = _as.getApplication(_as.appID);
      _as.application.subscribe(
        data => {
          _as.application = data.application;
          console.log(_as.application);
        },
      error => {
        if (_as.errortype === 'network') {
          if (_as.errors.status) {
            if (_as.errors.status === 401) {
              console.log('32:', _as.errors);
              localStorage.setItem('tokentouse', 'partner');
              _as.generateRefreshToken().subscribe(
                data => {
                  console.log(data);
                },
                error2 => {
                  console.log('39:', _as.errors);
                },
                () => {
                  console.log('42: ok');
                }
              );
            }
          }
        }
       // console.log('41: ', _as.errors);
      },
      () => {
        console.log('44');
      });
    }
  }

  ngOnInit() {
    init_plugins();
  }

}

