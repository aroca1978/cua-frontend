import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-cardprocessing',
  templateUrl: './cardprocessing.component.html',
  styles: []
})
export class CardprocessingComponent implements OnInit {

  cuacardprocessing: FormGroup;

  constructor() { }

  ngOnInit() {
  }
  saveCardProcessing() {
    return;
  }

}
