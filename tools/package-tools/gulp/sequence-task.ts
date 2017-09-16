// This import does not have any type definitions.
const gulpRunSequence = require('run-sequence');
var gutil = require('gulp-util');

/** Create a task that's a sequence of other tasks. */
export function sequenceTask(...args: any[]) {
  // gutil.log('args', args)
  return (done: any) => {
    gulpRunSequence(
      ...args,
      done
    );
  };
}