import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ApolloService } from '../../services/shared/apollo.service';
import { NgbActiveModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader } from '@agm/core';

import { FormGroup, FormControl } from '../../../../node_modules/@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-address-selector',
  templateUrl: './address-selector.component.html',
  styleUrls: ['./address-selector.component.css'],
})

// @Input appID: String;


export class AddressSelectorComponent implements OnInit {

  @Input()appID: string;
  @Input()targetField: string;

  addresses = [];
  addressSelectorForm: FormGroup;
  selectedAddress: FormControl;
  theselectedaddress: String;

  constructor(
    public _as: ApolloService,
    public activeModal: NgbActiveModal,
  ) {
    this.addressSelectorForm = new FormGroup({
      selectedAddress: new FormControl()
    });

    this.addressSelectorForm.valueChanges.subscribe(data => {
      console.log(data);
      if (data.selectedAddress) {
        if ((data.selectedAddress !== '') && (data.selectedAddress !== null)) {
          this.theselectedaddress = data.selectedAddress;
        }
      }
    });
  }

  ngOnInit() {

    // set google maps defaults
    localStorage.setItem('tokentouse', 'access');

    console.log('on init usando access');
    if (localStorage.getItem('appID')) {
      console.log('existe local app ID:', localStorage.getItem('appID') );
      console.log('this.appid:', this.appID);
      if (localStorage.getItem('appID') === this.appID) {
        console.log('son iguales');
      this._as.appID = localStorage.getItem('appID');



      this._as.application = this._as.getApplication(this._as.appID)
      .subscribe(
      data => {
        this._as.application = data.application;
        console.log(data);
        if (this._as.application.addresses.length > 0) {

          console.log(this._as.application.addresses);

          this.addresses = this._as.application.addresses;


        } else {
          // do nothing
        }
  // console.log(this._as.application);
      },
      error => {
        localStorage.setItem('tokentouse', 'access');
        console.log('error completo', error);
        console.log('Error getApplication:', this._as.errors);
      },
      () => {
        console.log('aqui');
        // this.setLocation(this.placeId);
        // this.prevAddress = true;
      });
    } else {
      console.log('aqui');
    }

    }
  }
  closeModal() {
    this.activeModal.close('Modal Closed');
  }
  selectAddress() {
    if   ((this.theselectedaddress) && ( this.theselectedaddress !== '')) {
      this.activeModal.close([this.addressSelectorForm.value, this.targetField]);
      console.log(this.theselectedaddress, this.targetField);
    } else {
      swal({
        type: 'error',
        title: 'Please select an address from the list',
        confirmButtonColor: '#304A1E'
      });
    }
  }
  translateType(thetype: number): string {
    let thereturn: string;
    switch (thetype) {
      case 0:
      thereturn = 'Business';
      break;
      case 1:
      thereturn = 'DBA';
      break;
      case 3:
      thereturn = 'Personal';
      break;
      case 4:
      thereturn = 'Third Party';
      break;
      case 5:
      thereturn = 'Equipment';
      break;
      case 6:
      thereturn = 'Owner';
      break;
      default:
      thereturn = 'Unknown';
      break;
    }
    return thereturn;
  }
}
