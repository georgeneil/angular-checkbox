import {BuildPackage, buildConfig} from 'material2-build-tools';
import {join} from 'path';

export const cdkPackage = new BuildPackage('cdk');
export const materialPackage = new BuildPackage('material', [cdkPackage]);

// To avoid refactoring of the project the material package will map to the source path `lib/`.
materialPackage.packageRoot = join(buildConfig.packagesDir, 'lib');