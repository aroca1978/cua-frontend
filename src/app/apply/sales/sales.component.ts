import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ApolloService } from '../../services/shared/apollo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader } from '@agm/core';
import { AddressSelectorComponent } from '../../components/address-selector/address-selector.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styles: [`
  agm-map {
    height: 200px;
  }
  ng-valid, .ng-valid:not(form) {
    border-left: 5px solid #42A948; /* green */
  }
  .ng-invalid:not(form)  {
    border-left: 5px solid #a94442; /* red */
  }
  `]
})

export class SalesComponent implements OnInit {

  cuasales: FormGroup;
  mask: any[] = [ /[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  phoneregex = /\b[0-9]{3}[\-. ]?[0-9]{3}[\-. ]?[0-9]{4}\b/;
  websiteregexp = /\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[\-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$]/i;
  nowebsite = false;
  payment_before = false;
  ismail = false;
  isphone = false;
  goodServeArray = [];
  goodServe = '';
  industry = [];
  subGoodServe = '';
  subindustry = [];
  time_in_advance_array: any[] = [
    { val: 0, op: '0-2 Days'},
    { val: 1, op: '3-30 Days'},
    { val: 2, op: '31-60 Days'},
    { val: 3, op: '61-90 Days'},
    { val: 4, op: 'Over 90 Days'}
  ];
  third_party = false;
  fulfillment_name = '';
  fulfillment_suite = '';

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public place: any;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  public fulfillment_address: FormControl;
  public refund_policy = '';
  public has_refund_policy = false;
  public seasonal = false;
  public seasonal_jan = false;
  public seasonal_feb = false;
  public seasonal_mar = false;
  public seasonal_apr = false;
  public seasonal_may = false;
  public seasonal_jun = false;
  public seasonal_jul = false;
  public seasonal_aug = false;
  public seasonal_sep = false;
  public seasonal_oct = false;
  public seasonal_nov = false;
  public seasonal_dec = false;
  public isSubmitting = false;



  constructor(
    public _as: ApolloService,
    private modalService: NgbModal,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.cuasales = new FormGroup({
      'website': new FormControl(null, [Validators.required, Validators.pattern(this.websiteregexp)]),
      'customer_service_phone': new FormControl(null, [ Validators.required,
        Validators.pattern(this.phoneregex)]),
      'nowebsite': new FormControl( false  ),
      'webHostingServer': new FormControl( null, Validators.required),
      'additional_websites': new FormControl( null ),
      'goodServe': new FormControl( null, Validators.required) ,
      'SIC': new FormControl(null),
      'business_description': new FormControl( null, Validators.required),
      'payment_before': new FormControl( null ),
      'mail_phone': new FormControl (null),
      'industry': new FormControl (null),
      'time_in_advance': new FormControl( null) ,
      'third_party': new FormControl( false),
      'fulfillment_name': new FormControl( null),
      'fulfillment_address': new FormControl( null ),
      'fulfillment_suite': new FormControl( null ),
      'refund_policy': new FormControl( null ),
      'has_refund_policy': new FormControl( false ),
      'refund_policy_link': new FormControl( null ),
      'seasonal': new FormControl( false ),
      'seasonal_jan': new FormControl( false ),
      'seasonal_feb': new FormControl( false ),
      'seasonal_mar': new FormControl( false ),
      'seasonal_apr': new FormControl( false ),
      'seasonal_may': new FormControl( false ),
      'seasonal_jun': new FormControl( false ),
      'seasonal_jul': new FormControl( false ),
      'seasonal_aug': new FormControl( false ),
      'seasonal_sep': new FormControl( false ),
      'seasonal_oct': new FormControl( false ),
      'seasonal_nov': new FormControl( false ),
      'seasonal_dec': new FormControl( false )
    });




  }

  ngOnInit() {
    this._as.getAllIndustries().subscribe(
      data => {
        this.goodServeArray = data.industry;
        console.log(this.goodServeArray);
      },
      error => {
        console.log(error);
      },
      () => {

      });

  //  console.log(this.industry);
  }
  saveSales() {
    let totalerrors = 0;
    const terror = new Array();
    if (this.cuasales.valid) {
      this.isSubmitting = true;
      console.log('valid');
      this._as.updateApplicationWebsite(
        this._as.appID,
        this.cuasales.controls['website'].value,
        this.cuasales.controls['customer_service_phone'].value,
        this.nowebsite).
      subscribe(
        data => {

        },
        error => {
          totalerrors++;
          terror.push(this._as.errors.statusText);
        },
        () => {


        }
      );

    } else {
      swal({
        type: 'error',
        title: 'Please fix the fields marked in red and try again',
        confirmButtonColor: '#304A1E'
      });
    }
    console.log(this.cuasales);
  }
  setNowebsite(e, v) {
    this.nowebsite = !this.nowebsite;
    const websiteField = [
      {
        field: 'website',
        validators: [Validators.required, Validators.pattern(this.websiteregexp)]
      },
      {
        field: 'webHostingServer',
        validators: Validators.required
      }
    ];
    websiteField.forEach ((eachObj) => {
      if (!this.nowebsite) {
        this.cuasales.controls[eachObj.field].setValidators(eachObj.validators);
      } else {
        this.cuasales.controls[eachObj.field].clearValidators();
      }
      this.cuasales.controls[eachObj.field].updateValueAndValidity();
    });
    return;
  }
  setGoodServe(e, v, i) {
    this.goodServe = i;
    this.industry = [];
    this._as.getIndustries(v).subscribe(
      data => {
        this.industry = data.industry;
        console.log(data);
      },
      error => {
        console.log(error);
      },
      () => {}
    );

    console.log(this.goodServe);
  }
  setSubGoodServe(v) {
    console.log(v);
    const tv = v.split('|');
    if (tv.length > 0) {
      this.subGoodServe = tv[1];

      this._as.getIndustries(tv[0]).subscribe(
        data => {
          this.subindustry = data.industry;
          console.log(data);
        },
        error => {
          console.log(error);
        },
        () => {

        }
      );
    }


  }
  setPaymentBefore(e, pb) {
    this.payment_before = pb;
    console.log(pb);

  }

  setMailPhone(e, mp) {
    if (mp === 'mail') {
      this.ismail = true;
      this.isphone = false;
    } else {
      this.ismail = false;
      this.isphone = true;
    }
  }
  setThirdParty(e, tp) {
    this.third_party = tp;
  }

  showSelectAddress() {
    const modalRef = this.modalService.open(AddressSelectorComponent, { centered: true });

    // modalRef.componentInstance.name = 'addressSelector';
    modalRef.componentInstance.appID = localStorage.getItem('appID'); // should be the id
   // modalRef.componentInstance.targetField = targetfield;
    modalRef.result.then((result) => {
      if (Array.isArray(result)) {
        if (result.length === 2) {
          this.setLocation(result[0].selectedAddress, result[1]);
        }
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  setLocation( placeId: any, typeLocation: String ) {
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

            this.latitude = this.place.geometry.location.lat();
            this.longitude = this.place.geometry.location.lng();
            this.zoom = 12;
            this.fulfillment_address = this.place.formatted_address;
            this.cuasales.controls['fulfillment_address'].setValue(this.fulfillment_address);
            console.log(this.fulfillment_address);

          });
        }
      });
    }
  }
  setRefundPolicy(e, v) {
    this.has_refund_policy = v;
  }
  setSeasonal (e, v) {
    this.seasonal = v;
  }


}
