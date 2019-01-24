
/// <reference types="googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// import 'googlemaps';


import { MapsAPILoader } from '../../../../node_modules/@agm/core';
import { ApolloService } from '../../services/shared/apollo.service';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddressSelectorComponent } from '../../components/address-selector/address-selector.component';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/forkJoin';


@Component({
  selector: 'app-businessinfo',
  templateUrl: './businessinfo.component.html',
  styles: [`
    agm-map {
      height: 200px;
    }
    .behindo {
      z-index: -1;
    }
    ng-valid, .ng-valid:not(form) {
      border-left: 5px solid #42A948; /* green */
    }
    .ng-invalid:not(form)  {
      border-left: 5px solid #a94442; /* red */
    }
  `],
})


export class BusinessinfoComponent implements OnInit {

  cuabusinessinfo: FormGroup;

  public latitude: number;
  public longitude: number;
  public latitude2: number;
  public longitude2: number;
  public searchControl: FormControl;
  public zoom: number;
  public zoom2: number;
  public place: any;
  public place2: any;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  public legal_name: string;
  public business_address: FormControl;
  public business_suite: string;
  public business_phone: string;
  public business_fax: string;
  public hasdba: boolean;
  public dbaName: string;
  public dba_address: FormControl;
  public dba_suite: string;
  public dbaPhone: string;
  public dbaFax: string;
  public personal_bankrupt: boolean;
  public personal_bankrupt_date: any;
  public business_bankrupt: boolean;
  public business_bankrupt_date: any;


  public searchControl1: FormControl;
  @ViewChild('search1')
  public searchElementRef1: ElementRef;

  public ba_placeId: string;
  public placeId1: string;
  public ba_address1: string;
  public ba_address2: string;
  public ba_state: string;
  public ba_city: string;
  public ba_zipCode: string;
  public ba_country: string;

  public prevAddress: boolean;

  public isSubmitting = false;
  public taxIdNum: string;
  model: NgbDateStruct;
  dateString: string;
  mask: any[] = [ /[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  mask2: any[] = [ /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  phoneregex = /\b[0-9]{3}[\-. ]?[0-9]{3}[\-. ]?[0-9]{4}\b/;
  dateregex = /#wpcf\d-f(\d*)-/;

  container = 'body';
  ownershiptypes: any[] = [{val: 0, op: 'Sole Propiertor'},
                            {val: 1, op: 'LLC'},
                            {val: 2, op: 'Partnership'},
                            {val: 3, op: 'LTD Liability Partnership'},
                            {val: 4, op: 'Government Entity'},
                            {val: 5, op: 'Trust'},
                            {val: 6, op: 'Professional Association'},
                            {val: 7, op: 'Political Organization'},
                            {val: 8, op: 'Public Corporation'},
                            {val: 9, op: 'Private Corporation'},
                            {val: 10, op: 'Non Profit Corporation'}];


  ownershiptype = '';

  updateApplicationDbaNameResult: any;
  updateApplicationDbaInfoResult: any;


  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private ngZone2: NgZone,
    public _as: ApolloService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.cuabusinessinfo = new FormGroup({
      'legal_name': new FormControl(null, Validators.required),
      'business_address': new FormControl(null, Validators.required),
      'business_suite': new FormControl(null),
      'business_phone': new FormControl(null, [ Validators.required,
        Validators.pattern(this.phoneregex)]),
      'business_fax': new FormControl(null, Validators.pattern(this.phoneregex)),
      'hasdba': new FormControl(false),
      'dbaName': new FormControl(null),
      'dba_address': new FormControl(null),
      'dba_suite': new FormControl(null),
      'dbaPhone': new FormControl(null),
      'dbaFax': new FormControl(null),
      'personal_bankrupt': new FormControl(null),
      'personal_bankrupt_date': new FormControl(null),
      'business_bankrupt': new FormControl(null),
      'business_bankrupt_date': new FormControl(null),
      'ownership_type': new FormControl('', Validators.required),
      'taxIdNum': new FormControl(null, Validators.required ),
      'businessBirthday': new FormControl( null )

    });
    this.cuabusinessinfo.controls['ownership_type'].setValue(this.ownershiptype, {onlySelf: true});


  }

  ngOnInit() {

  //  this.cuabusinessinfo.controls['legal_name'].setValue(this.legal_name, )
    this.hasdba = false;
    // set google maps defaults
    if (localStorage.getItem('appID')) {
      this._as.appID = localStorage.getItem('appID');
      this._as.application = this._as.getApplication(this._as.appID)
      .subscribe(
      data => {
        this._as.application = data.application;
        this.legal_name = this._as.application.businessName;
        console.log('APPLICATION DATA: ', this._as.application);

        if (this._as.application.addresses.length > 0) {
          console.log(this._as.application.addresses);
          const addresses = this._as.application.addresses;
          addresses.forEach(element => {
            if (element.addressType === 3) {
              this.business_address = element.address1;
              this.ba_placeId = element.placeId;
              console.log(element.address1, element.address2, element.city, element.country, element.state,
              element.zipcode, element.placeId);
            }
          });
        } else {
          this.setCurrentPosition();
        }
      },
      error => {
        console.log(this._as.application);
      },
      () => {
        this.prevAddress = true;
      });
    }

    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    this.zoom2 = 4;
    this.latitude2 = 39.8282;
    this.longitude2 = -98.5795;

    // set current position
    this.setCurrentPosition();

    this.loadAutocomplete();

    this.onSelectDate(this.model);
  }

  saveBusinessInfo() {
    let totalerrors = 0;
    const terror = new Array();
    if (this.cuabusinessinfo.valid) {
      this.isSubmitting = true;
      console.log('valid');


      if (this.place) {

        this.isSubmitting = true;
        const addressParts: any = this.getAddressParts(this.place);
        console.log(this.place);
        if (addressParts.street_number) {
          this.ba_address1 = addressParts.street_number;
        }
        if (addressParts.route) {
          this.ba_address1 += ' ' + addressParts.route;
        }
        if ( ( this.cuabusinessinfo.controls.business_suite.value !== null) &&
              ( this.cuabusinessinfo.controls.business_suite.value.length > 0)) {
          this.ba_address2 =  this.cuabusinessinfo.controls.business_suite.value;
        }
        if (addressParts.administrative_area_level_1) {
          this.ba_state = addressParts.administrative_area_level_1;
        }
        if (addressParts.locality) {
          this.ba_city = addressParts.locality;
        }
        if (addressParts.postal_code) {
          this.ba_zipCode = addressParts.postal_code;
        }
        if (addressParts.country) {
          this.ba_country = addressParts.country;
        }
        if (this.place.place_id) {
          this.ba_placeId = this.place.place_id;
        }
      }


      this._as.updateAppBizName(this._as.appID, this.cuabusinessinfo.controls['legal_name'].value).subscribe(
        data => {
          console.log('updateAppBizName data:', data);
       },
      error => {
        totalerrors++;
        terror.push(this._as.errors.statusText);
        console.log('updateAppBizName error: ' , this._as.errors, error);
      },
    () => {

      this._as.createAddresses(
        this._as.appID, 0, this.ba_address1,
        this.ba_address2, this.ba_state, this.ba_city,
        this.ba_zipCode, this.ba_country, this.ba_placeId
      ).subscribe(
        data => {
        console.log( 'resultado createAddress: ', data );
        localStorage.setItem('bus_address', data.createAddresses.id);
      },
      error => {
        totalerrors++;
        terror.push(this._as.errors.statusText);
        console.log('Error creating business address:', error);
      });



        console.log('appid: ', this._as.appID, 'hasdba: ', this.hasdba, 'legalname: ', this.cuabusinessinfo.controls['legal_name'].value );
        this._as.updateApplicationGotDba(
          this._as.appID, this.hasdba,
          this.cuabusinessinfo.controls['taxIdNum'].value,
          this.cuabusinessinfo.controls['legal_name'].value
        ).subscribe(data => {
          console.log('updateApplicationGotDba result: ', data);
        },
        error => {
          totalerrors++;
          terror.push(this._as.errors.statusText);
          console.log('updateApplicationGotDba error: ' , this._as.errors);
        },
        () => {
          if (this.hasdba) {
            localStorage.setItem('tokentouse', 'access');
            this._as.updateApplicationDbaName (
              this._as.appID,
              this.cuabusinessinfo.controls['dbaName'].value
            ).subscribe( data => {
              console.log('updateApplicationDbaname data:', data);
            },
            error => {
              console.log('updateApplicationDbaname error:', error);
            },
            () => {
              console.log('PLACE 2:', this.place2);
             // this._as.createAddresses(this._as.appID, 1, )




              this._as.updateApplicationDbaInfo(
                this._as.appID,
                this.removeNonNumbers(this.cuabusinessinfo.controls['dbaPhone'].value),
                this.removeNonNumbers(this.cuabusinessinfo.controls['dbaFax'].value)
              ).subscribe( data => {
                console.log('updateApplicationDbaInfo data:', data);
              },
              error => {
                console.log('updateApplicationDbaInfo data:', error);
              },
              () => {
                this.completeDbaChanges( totalerrors, terror );
              });
            });


            } else { // this does not have dba
              this.completeDbaChanges( totalerrors, terror );
            }
          });
        });

    } else {
      swal({
        type: 'error',
        title: 'Please fix the fields marked in red and try again',
        confirmButtonColor: '#304A1E'
      });
    }
    console.log(this.cuabusinessinfo);

  }

  private getAddressParts(object): Object {
    const address = {};
    const address_components = object.address_components;
    address_components.forEach(element => {
        address[element.types[0]] = element.short_name;
    });
    return address;
  }

  setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      },
    error => {
     console.log(error.message);
    });
    } else {
      console.log('geolocation is disabled in browser');
    }
  }


  setLocation( placeId: any, typeLocation: string, address2Val: string = null ) {
    if (placeId.length > 0) {
      const geocoder = new google.maps.Geocoder;
      // const mapservice = new google.maps.InfoWindow;
      geocoder.geocode({'placeId': placeId }, (place, status) => {
        const tstatus: any = status;
        if (tstatus === 'OK') {
          this.ngZone.run(() => {
            // get the place result
            this.place = place[0];
            // verify result
            if (this.place.geometry === undefined || this.place.geometry === null) {
              return;
            }
            // set latitude, longitude and zoom
            if (typeLocation === 'business_address') {
              this.latitude = this.place.geometry.location.lat();
              this.longitude = this.place.geometry.location.lng();
              this.zoom = 12;
              this.business_address = this.place.formatted_address;
              this.cuabusinessinfo.controls['business_address'].setValue(this.business_address);
              if (address2Val !== null) {
                this.cuabusinessinfo.controls['business_suite'].setValue(address2Val);
              }
              console.log(this.business_address);
            }
            if (typeLocation === 'dba_address') {
              this.latitude2 = this.place.geometry.location.lat();
              this.longitude2 = this.place.geometry.location.lng();
              this.zoom2 = 12;
              this.dba_address = this.place.formatted_address;
              this.cuabusinessinfo.controls['dba_address'].setValue(this.dba_address);
              if (address2Val !== null) {
                this.cuabusinessinfo.controls['dba_suite'].setValue(address2Val);
              }
              console.log(this.dba_address);
            }
            console.log(this);
          });
        }
      });
    }
  }

  copyPersonalAddress() {
    this.setLocation(this.ba_placeId, 'business_address');
  }
  setHasDba(e, v) {
    this.hasdba = !this.hasdba;
    console.log('event:', e);
    console.log('val:', v);
    console.log('VALOR:', this.cuabusinessinfo.controls['hasdba'].value);

    const dbafields = [
      {
        field: 'dbaName',
        validators: [Validators.required, Validators.minLength(3)]
      },
      {
        field: 'dba_address',
        validators: [Validators.required, Validators.minLength(3)]
      },
      {
        field: 'dbaPhone',
        validators: [Validators.required, Validators.pattern(this.phoneregex)]
      },
      {
        field: 'dbaFax',
        validators: [Validators.pattern(this.phoneregex)]
      }
    ];
  if (this.hasdba) {
    this.loadAutocomplete();
  }

    dbafields.forEach( (eachObj) => {
      if (this.hasdba) {
        this.cuabusinessinfo.controls[eachObj.field].setValidators(eachObj.validators);
      } else {
        this.cuabusinessinfo.controls[eachObj.field].clearValidators();
      }
      this.cuabusinessinfo.controls[eachObj.field].updateValueAndValidity();
    });
    return;
  }


  setBankrupt(e, v) {

    this.personal_bankrupt = !this.personal_bankrupt;
    console.log('event:', e);
    console.log('val:', v);
    console.log('VALOR:', this.cuabusinessinfo.controls['personal_bankrupt'].value);

    const bankruptFields = [
      {
      field: 'personal_bankrupt_date',
      validators: [Validators.required]
     }
  ];

  bankruptFields.forEach( (eachObj) => {
      if (this.personal_bankrupt) {
        this.cuabusinessinfo.controls[eachObj.field].setValidators(eachObj.validators);
      } else {
        this.cuabusinessinfo.controls[eachObj.field].clearValidators();
      }
      this.cuabusinessinfo.controls[eachObj.field].updateValueAndValidity();
    });
    return;
  }
  setBusBankrupt(e, v) {
    this.business_bankrupt = !this.business_bankrupt;
    console.log('event:', e);
    console.log('val:', v);
    console.log('VALOR:', this.cuabusinessinfo.controls['business_bankrupt'].value);

    const bankruptFields = [
      {
      field: 'business_bankrupt_date',
      validators: [Validators.required]
     }
  ];

  bankruptFields.forEach( (eachObj) => {
      if (this.business_bankrupt) {
        this.cuabusinessinfo.controls[eachObj.field].setValidators(eachObj.validators);
      } else {
        this.cuabusinessinfo.controls[eachObj.field].clearValidators();
      }
      this.cuabusinessinfo.controls[eachObj.field].updateValueAndValidity();
    });
    return;
  }

  onSelectDate(date: NgbDateStruct, type: string = '0') {
    if (date != null) {
      this.model = date;   // needed for first time around due to ngModel not binding during ngOnInit call. Seems like a bug in ng2.

      this.dateString = this.ngbDateParserFormatter.format(date);
      console.log(type);
      if (type === '1') {

        this.dateString = this.dateReformat(this.dateString);

      }
      console.log('DATE STRING: ', this.dateString);
    }
  }
  copyLegalAddress() {

      this.setLocation(this.ba_placeId, 'dba_address');
  }

  showSelectAddress(targetfield: string) {
    const modalRef = this.modalService.open(AddressSelectorComponent, { centered: true });
    console.log('target field: ', targetfield);
    // modalRef.componentInstance.name = 'addressSelector';
    modalRef.componentInstance.appID = localStorage.getItem('appID'); // should be the id
    modalRef.componentInstance.targetField = targetfield;
    modalRef.result.then((result) => {
      if (Array.isArray(result)) {
        let taddress2 = null;
        if (result.length === 2) {
          if (this._as.application.addresses) {
            const taddresses: any = this._as.application.addresses;
            if (taddresses.length > 0) {
              for (let i = 0; i < taddresses.length; i++) {
                if (taddresses[i].placeId === result[0].selectedAddress) {
                  taddress2 = taddresses[i].address2;
                }
              }
            }
          }


          console.log('DIRECCION ARRAY', result);
          this.setLocation(result[0].selectedAddress, result[1], taddress2);
        }
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  removeNonNumbers(thestring) {
    if (thestring !== null) {
      if (thestring.length > 0) {
        thestring = parseInt(thestring.replace(/\D/g, ''), 10);
      }
    }
    return thestring;
  }

  loadAutocomplete() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      const autocomplete2 = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.place = place;
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });

      autocomplete2.addListener('place_changed', () => {
        this.ngZone2.run(() => {
          // get the place result
          const place2: google.maps.places.PlaceResult = autocomplete2.getPlace();
          this.place2 = place2;
          // verify result
          if (place2.geometry === undefined || place2.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.latitude2 = place2.geometry.location.lat();
          this.longitude2 = place2.geometry.location.lng();
          this.zoom2 = 12;
        });
      });

      });
  }
  dateReformat(dateString: string): string {

    // mm/dd/yyyy
    // mm-yyyy
    const newDateString = dateString.split('/');

    return newDateString[0] + '-' + newDateString[2];

  }

  completeDbaChanges(totalerrors, terror): Observable<any[]>  {

    this._as.updateApplicationOwnershipType(this._as.appID, this.cuabusinessinfo.controls['ownership_type'].value, false)
    .subscribe( data => {
      console.log('updateApplicationOwnershipType result: ', data);
    },
    error => {
      totalerrors++;
      terror.push(this._as.errors.statusText);
      console.log('updateApplicationOwnershipType error a: ', error);
      console.log('updateApplicationOwnershipType error: ', this._as.errors);
    },
    () => {
      this._as.updateApplicationBizInfo( this._as.appID,
        this.removeNonNumbers(this.cuabusinessinfo.controls['business_phone'].value),
        this.removeNonNumbers(this.cuabusinessinfo.controls['business_fax'].value),
        this.dateString  ).subscribe( data => {
          console.log('updateApplicationBizInfo result: ', data);
        },
        error => {
          totalerrors++;
          terror.push(this._as.errors.statusText);
          console.log('updateApplicationBizInfo error a: ', error);
          console.log('updateApplicationBizInfo error b: ', this._as.errors);
        },
        () => {
          let pbdate: string;
          let pbmonth: string;
          let pbday: string;
          if (this.cuabusinessinfo.controls['personal_bankrupt_date'].value !== undefined) {
            this.personal_bankrupt_date = this.cuabusinessinfo.controls['personal_bankrupt_date'].value;
            if (this.personal_bankrupt_date !== null) {
              pbmonth = String(this.personal_bankrupt_date.month);
              pbday = String(this.personal_bankrupt_date.day);
              if (pbmonth.length === 1) {
                this.personal_bankrupt_date.month = '0' + this.personal_bankrupt_date.month;
              }
              if (pbday.length === 1) {
                this.personal_bankrupt_date.day = '0' + this.personal_bankrupt_date.day;
              }
              pbdate = this.personal_bankrupt_date.month +
              '-' + this.personal_bankrupt_date.day + '-' + this.personal_bankrupt_date.year;
            } else {
              pbdate = null;
            }
          } else {
            pbdate = null;
          }
          let bbdate: string;
          let bbmonth: string;
          let bbday: string;
          if (this.cuabusinessinfo.controls['business_bankrupt_date'].value !== undefined) {
            this.business_bankrupt_date = this.cuabusinessinfo.controls['business_bankrupt_date'].value;
            if (this.business_bankrupt_date !== null) {
              bbmonth = String(this.business_bankrupt_date.month);
              bbday = String(this.business_bankrupt_date.day);
              if (bbmonth.length === 1) {
                this.business_bankrupt_date.month = '0' + this.business_bankrupt_date.month;
              }
              if (bbday.length === 1) {
                this.business_bankrupt_date.day = '0' + this.business_bankrupt_date.day;
              }
              bbdate = this.business_bankrupt_date.month +
            '-' + this.business_bankrupt_date.day + '-' + this.business_bankrupt_date.year;
            } else {
              bbdate = null;
            }
          } else {
            bbdate = null;
          }
          this._as.updateApplicationBankrupt( this._as.appID,
            this.personal_bankrupt,
            this.business_bankrupt,
            pbdate,
            bbdate
          ).subscribe( data => {
            console.log('updateApplicationBankrupt result: ', data);
          },
          error => {
            totalerrors++;
            terror.push(this._as.errors.statusText);
            console.log('updateApplicationBankrupt error: ', this._as.errors, error);
          },
          () => {
            if (totalerrors > 0) {
              this.isSubmitting = false;
              let errorstring = '<ul>';
              for (let i = 0; i < terror.length; i++) {
                errorstring += '<li>' + terror[i] + '</li>';
              }
              errorstring += '</ul>';
              swal({
                type: 'error',
                title: 'There were errors saving your information. Please try it again.',
                html: errorstring,
                confirmButtonColor: '#304A1E'
              });
            } else {
              this.router.navigate(['/apply/sales']);
            }
          });
        });
    });

    return;
  }
}


