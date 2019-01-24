import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';


import swal from 'sweetalert2';
import { ApolloService } from '../../services/shared/apollo.service';
import { Router } from '@angular/router';

declare function init_plugins(); // esto lo hago para poder acceder a la función externa que declaré fuera de angular en assets/js/custom.js


@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: [ './lead.component.css' ]
})
export class LeadComponent implements OnInit {

  cdgleadform: FormGroup;
  subscription: Subscription;


  fName = '';
  lName = '';
  email = '';
  phone = '';
  contactmsg = '';
  isSubmitted = false;
  isSubmitting = false;
  partnerToken = '';
  signup = '';
  clientid = '';
  clientsecret = '';
  username = '';
  password = '';
  accessToken = '';
  refreshToken = '';
  ptExp = '';
  curtime = new Date().getTime();
  authId = '';
  authKey = '';
  tokentouse = '';
  appID = '';
  leadID = '';
  refNum = '';
  baseName = '';
  curnumber: number;

  myName: string;
  myEmail: string;
  myPhone: string;



  constructor( public _as: ApolloService,  private router: Router) {
    if (localStorage.getItem('partnerToken')) {
      this.partnerToken = localStorage.getItem('partnerToken');
    }
    if (!localStorage.getItem('baseName')) {
      this.baseName = this.randomString(4);
      localStorage.setItem('baseName', this.baseName);
      localStorage.setItem('curnumber', '0');
      this.curnumber = 0;
    } else {
      this.baseName = localStorage.getItem('baseName');
      if (localStorage.getItem('curnumber')) {
        this.curnumber = (Number)(localStorage.getItem('curnumber'));
        this.curnumber++;

        localStorage.setItem('curnumber', String(this.curnumber));
      } else {
        localStorage.setItem('curnumber', '0');
        this.curnumber = 0;
      }
    }



    this.myName = 'andresr' + this.baseName + this.curnumber;
    this.myEmail = this.myName + '@cdgcommerce.com';
    this.myPhone = '55555555' + this.baseName + this.curnumber;
    if (this.myPhone.length > 10) {
      this.myPhone = this.myPhone.substr(-10, 10);
    }





    if (localStorage.getItem('partnerTokenExpiration')) {
      this.ptExp = localStorage.getItem('partnerTokenExpiration');
    }
    console.log('current: ', this.curtime, ' expira: ', this.ptExp, 'Diferencia: ', (Number(this.ptExp) - this.curtime) / 1000);

    if ((this.partnerToken  === '')
        || (this.partnerToken  === undefined)
        || (this.partnerToken  === null)
        || (this.ptExp === undefined)
        || (this.ptExp === null)
      ) {
        localStorage.setItem('tokentouse', '');
      _as.getPartnerToken();
      console.log ('no habia token, lo pedi');
    } else if (Number(this.ptExp) < this.curtime) {
      localStorage.setItem('tokentouse', '');
      _as.getPartnerToken();

      console.log('estaba vencido, renové');
    } else {
      console.log('68 there is a partner token: ', localStorage.getItem('partnerToken'));
    }
    if (_as.errors) {
      if (_as.errors === 'User already exists') {
        console.log('need to login');
      }
    }
   }



  ngOnInit() {
    init_plugins();
    this.cdgleadform = new FormGroup({
      fName: new FormControl( null, [Validators.required, Validators.minLength(3)] ),
      lName: new FormControl( null,  [Validators.required, Validators.minLength(3)] ),
      email: new FormControl( null, [Validators.required, Validators.email ]),
      phone: new FormControl( null, Validators.required ),
    });




  this.cdgleadform.setValue({
    fName: 'Andres',
    lName: 'Roca',
    email: this.myEmail,
    phone: this.myPhone
  });
  }


  submitLead() {
    const terror = [];
    let invalid = false;
    console.log('Forma: ', this.cdgleadform);
    console.log(this.cdgleadform.value);
    if (this.cdgleadform.invalid) {
      invalid = true;
    }
    if (invalid === true) {

      if ( this.cdgleadform.controls.fName.status === 'INVALID' ) {
        terror.push('Please enter your First Name');
      }
      if ( this.cdgleadform.controls.lName.status === 'INVALID' ) {
        terror.push('Please enter your Last Name');
      }
      if ( this.cdgleadform.controls.email.status === 'INVALID' ) {
        terror.push('Please enter a valid e-mail address');
      }
      if ( this.cdgleadform.controls.phone.status === 'INVALID' ) {
        terror.push('Please enter a phone number');
      }
      let terrorstring = '';
      if (terror.length > 0 ) {
        terrorstring += '<ul style="padding:0;">';
        let i: number;
        for (i = 0; i < terror.length; i++) {
          terrorstring += '<li>' + terror[i] + '</li>';
        }
        terrorstring += '</ul>';

        const swalerrors = ['Please try it again!', 'You\'re almost there', 'There was an error...' ];
        const swalerr = swalerrors[ Math.floor( Math.random() * swalerrors.length )];


        swal({
          type: 'error',
          title: swalerr,
          html: terrorstring,
          confirmButtonColor: '#304A1E'
        });
      }

    } else { // form is valid
      this.isSubmitting = true;
      this.isSubmitted = true;
      localStorage.setItem('tokentouse', 'partner');
      this._as.signup(this.cdgleadform.controls['email'].value, this.cdgleadform.controls['phone'].value)
      .subscribe( data => {
        this.clientid = data.signup.client.id;
        this.clientsecret = data.signup.client.secret;
        this.username = data.signup.email;
        this.password = data.signup.password;
        localStorage.setItem('clientid', this.clientid);
        localStorage.setItem('clientsecret', this.clientsecret);

      },
      error => {
        this.isSubmitting = false;
        swal({
          type: 'error',
          title: 'User already exist',
          html: 'The user already exist',
          confirmButtonColor: '#304A1E'
        });
        console.log('81: ' , this._as.errors);
        return this._as.errors;
      },
      () => {
      console.log('86 username:', this.username);
      localStorage.setItem('tokentouse', 'partner');
      console.log('generating token');
        this._as.generateToken(this.username, this.password)
        .subscribe( data => {
        const currentTime = new Date().getTime();
        const expTime: any = currentTime + 3600000;
        localStorage.setItem('accessTokenExpiration', expTime);
        localStorage.setItem('accessToken', data.generateToken.accessToken);
        localStorage.setItem('refreshToken', data.generateToken.refreshToken);
        },
        error => {
        console.log('90: ' , this._as.errors);
        },
        () => {
        localStorage.setItem('tokentouse', 'access');
        this._as.createLeadsBasicInfo(this.cdgleadform.controls['fName'].value,
                            this.cdgleadform.controls['lName'].value,
                            this.cdgleadform.controls['email'].value,
                            this.cdgleadform.controls['phone'].value
                          ).subscribe(data => {
                            this.leadID = data.id;
                            localStorage.setItem('leadID', this.leadID);
                          },
                        error => {
                          console.log('115: ' , this._as.errors);
                        },
                      () => {
                        this._as.queryReferral('6RH743CDG')
                        .subscribe( data => {
                          this.refNum = data;
                        },
                      error => {
                        console.log('150:', this._as.errors);
                      },
                      () => {
                        localStorage.setItem('refNum', this.refNum);
                        console.log('154:', this.refNum);
                        this._as.createApplicationBasicInfo(this.refNum, this.leadID, false)
                                .subscribe( data => {
                                  this.appID = data.id;
                                  localStorage.setItem('appID', this.appID);
                                },
                              error => {
                                console.log('161: ', this._as.errors);
                              },
                              () => {
                                this.navigateTo('/apply');
console.log(this);
                              });


                      });
                    });
            }
          );
      });
    }
  }

  navigateTo( location: string ) {
    this.router.navigate([location]);
  }

  randomString(size: number) {
    let text = '';
    const possible = '0123456789';
    for (let i = 0; i < size; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}

