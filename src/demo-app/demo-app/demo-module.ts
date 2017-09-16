import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DemoApp, Home} from './demo-app';
import {DEMO_APP_ROUTES} from './routes';
import {CheckboxDemo} from '../checkbox/checkbox-demo';
import {DemoMaterialModule} from '../demo-material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DEMO_APP_ROUTES),
    DemoMaterialModule,
  ],
  declarations: [
    CheckboxDemo,
    DemoApp,
    Home
  ],
  providers: [
  ],
  entryComponents: [
    DemoApp,
  ],
})
export class DemoModule {}
