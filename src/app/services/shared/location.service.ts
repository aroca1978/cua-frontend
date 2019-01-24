import { Injectable, NgZone } from '@angular/core';
import { FormControl } from '../../../../node_modules/@angular/forms';
import { MapsAPILoader } from '../../../../node_modules/@agm/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public place: any;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  public setCurrentPosition() {

    if ('geolocation' in navigator) {
      // console.log(navigator.geolocation);
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
      // console.log('no geolocation');
    }
  }

  public getAddressParts(object): Object {
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
            console.log(this.searchControl);
          });
        }
      });
    }
  }
}
