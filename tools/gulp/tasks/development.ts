import {task} from 'gulp';
import {tsBuildTask, copyTask, serverTask, buildAppTask} from '../util/task_helpers';
import {join} from 'path';
import {
  buildConfig, buildScssTask, sequenceTask, watchFiles
} from 'material2-build-tools';
var gutil = require('gulp-util');

const {outputDir, packagesDir, projectDir} = buildConfig;

const appDir = join(packagesDir, 'demo-app');
const outDir = join(outputDir, 'packages', 'demo-app');

task(':watch:devapp', () => {
  watchFiles(join(appDir, '**/*.ts'), [':build:devapp:ts']);
  watchFiles(join(appDir, '**/*.scss'), [':build:devapp:scss']);
  watchFiles(join(appDir, '**/*.html'), [':build:devapp:assets']);

  // The themes for the demo-app are built by the demo-app using the SCSS mixins from Material.
  // Therefore when SCSS files have been changed, the custom theme needs to be rebuilt.
  // watchFiles(join(materialOutPath, '**/*.scss'), [':build:devapp:scss']);
});

/** Path to the demo-app tsconfig file. */
gutil.log('appDir', appDir)
const tsconfigPath = join(appDir, 'tsconfig-build.json');

task(':build:devapp:ts', tsBuildTask(tsconfigPath));
task(':build:devapp:scss', buildScssTask(outDir, appDir));
task(':build:devapp:assets', copyTask(appDir, outDir));
task('build:devapp', buildAppTask('devapp'));

task(':serve:devapp', serverTask(outDir, true));

task('serve:devapp', ['build:devapp'], sequenceTask(
  [':serve:devapp', ':watch:devapp']
));