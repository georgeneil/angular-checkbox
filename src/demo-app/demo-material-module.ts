import {NgModule} from '@angular/core';
import {
  MdCheckboxModule,
} from '@angular/material';

/**
 * NgModule that includes all Material modules that are required to serve the demo-app.
 */
@NgModule({
  exports: [
    MdCheckboxModule
  ]
})
export class DemoMaterialModule {}
