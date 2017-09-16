import {join} from 'path';
import {main as tsc} from '@angular/tsc-wrapped';
import {buildConfig} from './build-config';
import {getSecondaryEntryPointsForPackage} from './secondary-entry-points';
import {buildPrimaryEntryPointBundles, buildSecondaryEntryPointBundles} from './build-bundles';
var gutil = require('gulp-util');

const {packagesDir, outputDir} = buildConfig;

/** Name of the tsconfig file that is responsible for building a package. */
const buildTsconfigName = 'tsconfig-build.json';

export class BuildPackage {
    /** Path to the package sources. */
    packageRoot: string;

    /** Path to the package output. */
    packageOut: string;

    /** Path to the entry file of the package in the output directory. */
    private entryFilePath: string;

    /** Secondary entry points for the package. */
    get secondaryEntryPoints(): string[] {
        if (!this._secondaryEntryPoints) {
        this._secondaryEntryPoints = getSecondaryEntryPointsForPackage(this);
        }

        return this._secondaryEntryPoints;
    }

    private _secondaryEntryPoints: string[];

    constructor(public packageName: string, public dependencies: BuildPackage[] = []) {
        this.packageRoot = join(packagesDir, packageName);
        this.packageOut = join(outputDir, 'packages', packageName);

        this.entryFilePath = join(this.packageOut, 'index.js');
    }

    /** Compiles the package sources with all secondary entry points. */
    async compile() {
        await this._compileEntryPoint(buildTsconfigName);

        // Walk through every secondary entry point and build the TypeScript sources sequentially.
        for (const entryPoint of this.secondaryEntryPoints) {
        await this._compileEntryPoint(buildTsconfigName, entryPoint);
        }
    }

    /** Creates all bundles for the package and all associated entry points. */
    async createBundles() {
        await buildPrimaryEntryPointBundles(this.entryFilePath, this.packageName);

        for (const entryPoint of this.secondaryEntryPoints) {
            const entryPointEntryFilePath = join(this.packageOut, entryPoint, 'index.js');
            await buildSecondaryEntryPointBundles(entryPointEntryFilePath, this.packageName, entryPoint);
        }
    }

    /** Compiles the TypeScript sources of a primary or secondary entry point. */
    private async _compileEntryPoint(tsconfigName: string, secondaryEntryPoint?: string) {
        const entryPointPath = join(this.packageRoot, secondaryEntryPoint || '');
        const entryPointTsconfigPath = join(entryPointPath, tsconfigName);

        gutil.log('entryPointTsconfigPath', entryPointTsconfigPath)
        await tsc(entryPointTsconfigPath, {basePath: entryPointPath});
    }
}