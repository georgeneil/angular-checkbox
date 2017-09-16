import {Routes} from '@angular/router';
import {Home} from './demo-app';
import {DemoApp} from './demo-app';
import {CheckboxDemo} from '../checkbox/checkbox-demo';

export const DEMO_APP_ROUTES: Routes = [
  {path: '', component: DemoApp, children: [
    {path: '', component: Home},
    {path: 'checkbox', component: CheckboxDemo},
  ]}
];

export const ALL_ROUTES: Routes = [
  {path: '',  component: DemoApp, children: DEMO_APP_ROUTES},
];