import {NgModule} from '@angular/core';

// import {MdCommonModule, MdRippleModule} from './core';
import {MdCheckboxModule} from './checkbox/index';

const MATERIAL_MODULES = [
  MdCheckboxModule
];

/** @deprecated */
@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class MaterialModule {}