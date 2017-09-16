import {createPackageBuildTasks} from 'material2-build-tools';
import {cdkPackage, materialPackage} from './packages';

createPackageBuildTasks(cdkPackage);
createPackageBuildTasks(materialPackage);

import './tasks/clean';
import './tasks/development';
import './tasks/material-release';