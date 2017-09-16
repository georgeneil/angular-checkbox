import {dest, src, task} from 'gulp';
import {join} from 'path';
import {inlineResourcesForDirectory} from '../inline-resources';
import {buildScssTask} from './build-scss-task';
import {sequenceTask} from './sequence-task';
import {BuildPackage} from '../build-package';
import {watchFiles} from './watch-files';
var gutil = require('gulp-util');

// There are no type definitions available for these imports.
const htmlmin = require('gulp-htmlmin');

const htmlMinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  caseSensitive: true,
  removeAttributeQuotes: false
};

/** Creates a set of gulp tasks that can build the specified package. */
export function createPackageBuildTasks(buildPackage: BuildPackage) {
    // Name of the package build tasks for Gulp.
    const taskName = buildPackage.packageName;

    // Name of all dependencies of the current package.
    const dependencyNames = buildPackage.dependencies.map(p => p.packageName);

    // Glob that matches all style files that need to be copied to the package output.
    const stylesGlob = join(buildPackage.packageRoot, '**/*.+(scss|css)');

    // Glob that matches every HTML file in the current package.
    const htmlGlob = join(buildPackage.packageRoot, '**/*.html');

    // List of watch tasks that need run together with the watch task of the current package.
    const dependentWatchTasks = buildPackage.dependencies.map(p => `${p.packageName}:watch`);

    // gutil.log('taskName', taskName)
    task(`${taskName}:clean-build`, sequenceTask('clean', `${taskName}:build`));

    task(`${taskName}:build`, sequenceTask(
        // Build all required packages before building.
        ...dependencyNames.map(pkgName => `${pkgName}:build`),
        // Build ESM and assets output.
        [`${taskName}:build:esm`, `${taskName}:assets`],
        // Inline assets into ESM output.
        `${taskName}:assets:inline`,
        // Build bundles on top of inlined ESM output.
        `${taskName}:build:bundles`,
    ));

    /**
    * TypeScript compilation tasks. Tasks are creating ESM, FESM, UMD bundles for releases.
    */
    task(`${taskName}:build:esm`, () => buildPackage.compile());

    task(`${taskName}:build:bundles`, () => buildPackage.createBundles());

    /**
    * Asset tasks. Building SASS files and inlining CSS, HTML files into the ESM output.
    */
    task(`${taskName}:assets`, [
        `${taskName}:assets:scss`,
        `${taskName}:assets:copy-styles`,
        `${taskName}:assets:html`
    ]);

    task(`${taskName}:assets:scss`, buildScssTask(
        buildPackage.packageOut, buildPackage.packageRoot, true)
    );

    task(`${taskName}:assets:copy-styles`, () => {
        return src(stylesGlob).pipe(dest(buildPackage.packageOut));
    });
    task(`${taskName}:assets:html`, () => {
        return src(htmlGlob).pipe(htmlmin(htmlMinifierOptions)).pipe(dest(buildPackage.packageOut));
    });

    task(`${taskName}:assets:inline`, () => inlineResourcesForDirectory(buildPackage.packageOut));    

    /**
    * Watch tasks, that will rebuild the package whenever TS, SCSS, or HTML files change.
    */
    task(`${taskName}:watch`, dependentWatchTasks, () => {
        watchFiles(join(buildPackage.packageRoot, '**/*.+(ts|scss|html)'), [`${taskName}:build`]);
    });
}