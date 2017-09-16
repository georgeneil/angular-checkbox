import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'md-checkbox-demo',
  templateUrl: 'checkbox-demo.html',
//   styleUrls: ['checkbox-demo.css'],
})
export class CheckboxDemo {
  isIndeterminate: boolean = false;
  isChecked: boolean = false;
  isDisabled: boolean = false;
  alignment: string = 'start';
    useAlternativeColor: boolean = false;

//   printResult() {
//     if (this.isIndeterminate) {
//       return 'Maybe!';
//     }
//     return this.isChecked ? 'Yes!' : 'No!';
//   }

  checkboxColor() {
    return this.useAlternativeColor ? 'primary' : 'accent';
  }
}