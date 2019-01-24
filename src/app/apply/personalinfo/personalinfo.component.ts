/// <reference types="googlemaps" />
import { ElementRef, NgZone, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import swal from 'sweetalert2';
import { ApolloService } from '../../services/shared/apollo.service';
import { Router } from '@angular/router';
import { Application } from '../../interfaces/application.interface';

@Component({
  selector: 'app-personalinfo',
  templateUrl: './personalinfo.component.html',
  styleUrls: ['./personalinfo.component.css']
})
export class PersonalinfoComponent implements OnInit {
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public place: any;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  public cuapersonalinfo: FormGroup;
  public curapp: Application;
  public appID: String;
  public address1: String;
  public address2: String;
  public placeId = '';
  public fullAddress: String;
  public prevAddress: boolean;
  public isSubmitting = false;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public _as: ApolloService,
    private router: Router
  ) {
    console.log('constructor');
  }

  ngOnInit() {

console.log('ngOnInit');
  this.cuapersonalinfo = new FormGroup( {
    address1: new FormControl(null, Validators.required),
      address2: new FormControl(null)
  });


  if (localStorage.getItem('appID')) {
    this._as.appID = localStorage.getItem('appID');
    this._as.application = this._as.getApplication(this._as.appID)
      .subscribe(
        data => {
          this._as.application = data.application;
          // console.log(data);
          if (this._as.application.addresses.length > 0) {

             console.log('addresses', this._as.application.addresses);

            const addresses = this._as.application.addresses;

            addresses.forEach(element => {
              if (element.addressType === 3) {
                this.address1 = element.address1;
                this.placeId = element.placeId;
                console.log(element.address1, element.address2, element.city, element.country, element.state,
                  element.zipcode, element.placeId);
              }
            });
          } else {
            console.log('setting current position');
            this.setCurrentPosition();
          }
        },
      error => {
       console.log(this._as.application);
       console.log('setting current position');
            this.setCurrentPosition();
    },
     () => {
     this.setLocation(this.placeId);
     this.prevAddress = true;
    });
  } else {

      // set google maps defaults
  this.zoom = 4;
  this.latitude = 39.8282;
  this.longitude = -98.5795;


  // create search FormControl

      // set current position
      console.log('setting current position');
    this.setCurrentPosition();

  }




  this.searchControl = new FormControl();


  // load Places Autocomplete
  this.mapsAPILoader.load().then(() => {
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
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
  });
  }

  public setCurrentPosition() {

    if ('geolocation' in navigator) {
       console.log('geolocation: ', navigator.geolocation);
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
        // console.log('setting position. Latitude: ', this.latitude, 'Longitude:', this.longitude);
      },
    error => {
     console.log(error.message);
    });
    } else {
      console.log('no geolocation');
    }
  }

  public savePersonalInfo() {
    if (localStorage.getItem('appID')) {

      const appID = localStorage.getItem('appID');
      if (this.place) {
      this.isSubmitting = true;
      const addressParts: any = this.getAddressParts(this.place);
      console.log(this.place);
      let address1 = null;
      if (addressParts.street_number) {
        address1 = addressParts.street_number;
      }
      if (addressParts.route) {
        address1 += ' ' + addressParts.route;
      }
      let address2 = null;
      if ( ( this.cuapersonalinfo.controls.address2.value !== null) && ( this.cuapersonalinfo.controls.address2.value.length > 0)) {
        address2 =  this.cuapersonalinfo.controls.address2.value;
      }
      let state = null;
      if (addressParts.administrative_area_level_1) {
        state = addressParts.administrative_area_level_1;
      }
      let city = null;
      if (addressParts.locality) {
        city = addressParts.locality;
      }
      let zipCode = null;
      if (addressParts.postal_code) {
        zipCode = addressParts.postal_code;
      }
      let country = null;
      if (addressParts.country) {
        country = addressParts.country;
      }
      let placeId = null;
      if (this.place.place_id) {
        placeId = this.place.place_id;
      }

      this._as.createAddresses(
        appID, 3, address1, address2, state, city, zipCode, country, placeId
      ).subscribe( data => {
        console.log( 'resultado createAddress: ', data );
        localStorage.setItem('per_address', data.createAddresses.id);
      },
      error => {
        this.isSubmitting = false;
        const terror = this._as.errors.statusText;
        swal({
          type: 'error',
          title: 'Error creating address',
          html: terror,
          confirmButtonColor: '#304A1E'
        });
        console.log('129: ' , this._as.errors);
        return this._as.errors;
      },
      () => {
        this.router.navigate(['/apply/businessinfo']);
      });

      } else {
        swal({
          type: 'error',
          title: 'Please select your address.',
          confirmButtonColor: '#304A1E'
        });
      }
    }
  }
  private getAddressParts(object): Object {
    const address = {};
    const address_components = object.address_components;
    address_components.forEach(element => {
        address[element.types[0]] = element.short_name;
    });
    return address;
  }




  public setLocation(placeId) {
    if (placeId.length > 0) {



      const geocoder = new google.maps.Geocoder;
      const mapservice = new google.maps.InfoWindow;
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
            this.latitude = this.place.geometry.location.lat();
            this.longitude = this.place.geometry.location.lng();
            this.zoom = 12;
            this.searchControl.setValue(this.place.formatted_address);
            this.cuapersonalinfo.controls['address1'].setValue(this.place.formatted_address);
            console.log(this.searchControl);

          });
        }
      });
    }
  }
}
