import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


function padNumber(value: number) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    } else {
        return '';
    }
}

function toInteger( value: any ): number {
    return parseInt(`${value}`, 10);
}

function isNumber( value: any ): boolean {
    return !isNaN(toInteger(value));
}

export class CustomNgbDateParserFormatter2 extends NgbDateParserFormatter {


    format(date: NgbDateStruct): string {
        return date ? `${padNumber(date.month)}/${padNumber(date.day)}/${date.year}` : '';
      }
      parse(value: string): NgbDateStruct {
          if (value) {
        const dateParts = value.trim().split('.');
        if (dateParts.length === 1 && isNumber(dateParts[0])) {
          return {year: null, month: toInteger(dateParts[0]), day: null};
        } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
          return {year: null, month: toInteger(dateParts[0]), day: toInteger(dateParts[1])};
        } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
          return {year: toInteger(dateParts[2]), month: toInteger(dateParts[0]), day: toInteger(dateParts[1])};
        }
      }
      return null;
      }
}
