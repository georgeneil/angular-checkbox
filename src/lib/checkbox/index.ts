import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MdCheckbox} from './checkbox';

@NgModule({
  imports: [CommonModule],
  exports: [MdCheckbox],
  declarations: [MdCheckbox],
  // providers: [FocusOriginMonitor]
})
export class MdCheckboxModule {}

export * from './checkbox';