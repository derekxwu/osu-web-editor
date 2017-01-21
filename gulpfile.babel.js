import gulp from 'gulp';
import LessAutoprefix from 'less-plugin-autoprefix';
import cleancss from 'gulp-clean-css';
import del from 'del';
import {exec} from 'child_process';
import less from 'gulp-less';
import path from 'path';
import webpack from 'webpack-stream';

gulp.task('default', ['build:p', 'run']);

gulp.task('build', ['js', 'css']);
gulp.task('build:p', ['js:p', 'css:p']);

gulp.task('js', () => {
	return gulp.src('./src/app-client.js')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('./static/js'));
});
gulp.task('js:p', () => {
	return gulp.src('./src/app-client.js')
		.pipe(webpack(require('./webpack.production.config.js')))
		.pipe(gulp.dest('./static/js'));
});

gulp.task('css', () => {
	var autoprefix = new LessAutoprefix({browsers: ['last 2 versions']});
	return gulp.src('./src/styles/*.less')
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')],
			plugins: [autoprefix]
		}))
		.pipe(gulp.dest('./static/css/'));
});
gulp.task('css:p', () => {
	var autoprefix = new LessAutoprefix({browsers: ['last 2 versions']});
	return gulp.src('./src/styles/*.less')
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')],
			plugins: [autoprefix]
		}))
		.pipe(cleancss({
			level: 2
		}))
		.pipe(gulp.dest('./static/css/'));
});

gulp.task('run', () => {
	// TODO: This sucks and gulp will say it's finished while the server is
	// still running
	return exec('"./node_modules/.bin/http-server" static/');
});

gulp.task('clean', () => {
	del([
		'./static/css/*',
		'./static/js/*',
		'./.babel_cache/'
	]).then((paths) => {
		console.log('Deleted files and folders:\n', paths.join('\n'));
	});
	return;
});