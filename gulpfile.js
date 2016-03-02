var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var gulpsass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var browsersync = require('browser-sync').create();

var reportError = function (error) {
    var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

    notify({
        title: 'Task Failed [' + error.plugin + ']',
        message: lineNumber + 'See console.',
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);

    gutil.beep(); // Beep 'sosumi' again

    // Inspect the error object
    //console.log(error);

    // Easy error reporting
    //console.log(error.toString());

    // Pretty error reporting
    var report = '';
    var chalk = gutil.colors.white.bgRed;

    report += chalk('TASK:') + ' [' + error.plugin + ']\n';
    report += chalk('PROB:') + ' ' + error.message + '\n';
    if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
    if (error.fileName)   { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
    console.error(report);

    // Prevent the 'watch' task from stopping
    this.emit('end');
}

gulp.task('sass', () => {
	return gulp.src('my_project/assets/sass/i.scss')
	.pipe(plumber({
		errorHandler: reportError
	}))
	//.pipe(sourcemaps.init())
	.pipe(gulpsass())
	.pipe(cssnano())
	//.pipe(sourcemaps.write())
	.pipe(gulp.dest('my_project/build/css'))
	.pipe(browsersync.stream());
});

gulp.task('js', () => {
	return gulp.src([
		'bower_copmonents/jquery/dist/jquery.js',
		'bower_copmonents/bootstrap-sass/javascript/bootstrap.js',
		'my_project/assets/js/main.js'
	])
	.pipe(plumber({
		errorHandler: reportError
	}))
	//.pipe(sourcemaps.init())
	.pipe(concat('main.js'))
	.pipe(uglify())
	//.pipe(sourcemaps.write())
	.pipe(gulp.dest('my_project/build/js'));
});

gulp.task('image', () => {
	return gulp.src('my_project/assets/image/*')
	.pipe(plumber({
		errorHandler: reportError
	}))
	.pipe(imagemin({
		optimizationlevel: 5
	}))
	.pipe(gulp.dest('my_project/build/image'));
});

gulp.task('browser-sync', () => {
	browsersync.init({
		proxy: 'localhost/gulp_sass_introductions/my_project'
	});
});

gulp.task('watch', () => {
	gulp.watch('my_project/assets/sass/*.scss', ['sass']);
	gulp.watch('my_project/assets/js/*.js', ['js']);
	gulp.watch('my_project/assets/image/*', ['image']);
	gulp.watch('my_project/**/*.html').on('change', browsersync.reload);
});

gulp.task('default', [
		'sass',
		'js',
		'image',
		'browser-sync',
		'watch'
	]
);
