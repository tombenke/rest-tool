var gulp = require('gulp');
var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var through = require('gulp-through');
var debug = require('gulp-debug');
var buffer = require('vinyl-buffer');
var markdown = require('gulp-markdown');

gulp.task('docgen', function() {
    gulp.src('docs/*.md', {base: 'docs/'})
        .pipe(buffer())
        .pipe(markdown())
        .pipe(rename(function(path) {
            path.extname = '.html';
        }))
        .pipe(through('subs', function(file, config) {
            var content = file.contents.toString();
            gulp.src('docs/pageTemplate.html', {})
                .pipe(buffer())
                .pipe(mustache({body: content}))
                .pipe(rename(file.path))
                .pipe(gulp.dest('./'));
        }, {})());
});
