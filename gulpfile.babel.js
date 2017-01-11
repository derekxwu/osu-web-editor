import gulp from 'gulp';
import LessAutoprefix from 'less-plugin-autoprefix';
import cleancss from 'gulp-clean-css';
import del from 'del';
import {exec} from 'child_process';
import less from 'gulp-less';
import path from 'path';
import webpack from 'webpack-stream';

gulp.task('default', ['run']);

gulp.task('buildq', ['buildjs', 'buildcss']);
gulp.task('build', ['buildjs:p', 'buildcss:p']);

gulp.task('buildjs', () => {
	return gulp.src('./src/app-client.js')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('./src/static/js'));
});
gulp.task('buildjs:p', () => {
	return gulp.src('./src/app-client.js')
		.pipe(webpack(require('./webpack.production.config.js')))
		.pipe(gulp.dest('./src/static/js'));
});

gulp.task('buildcss', () => {
	var autoprefix = new LessAutoprefix({browsers: ['last 2 versions']});
	return gulp.src('./src/styles/*.less')
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')],
			plugins: [autoprefix]
		}))
		.pipe(gulp.dest('./src/static/css/'));
});
gulp.task('buildcss:p', () => {
	var autoprefix = new LessAutoprefix({browsers: ['last 2 versions']});
	return gulp.src('./src/styles/*.less')
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')],
			plugins: [autoprefix]
		}))
		.pipe(cleancss({
			level: 2
		}))
		.pipe(gulp.dest('./src/static/css/'));
});

gulp.task('runq', () => {
	return exec('"./node_modules/.bin/http-server" src/static/');
});
gulp.task('run', ['buildq'], () => {
	// TODO: This sucks and gulp will say it's finished while the server is
	// still running
	return exec('"./node_modules/.bin/http-server" src/static/');
});
gulp.task('runp', ['build'], () => {
	return exec('"./node_modules/.bin/http-server" src/static/');
});

gulp.task('clean', () => {
	return del([
		'./src/static/css/*',
		'./src/static/js/*'
	]);
});