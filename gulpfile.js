// v.1.2.0

/* Tasks:
copy - copy files From To... Uses p.copy array. 
del - clear files from build folder.

sass - build sass files. From sass folder to build folder.
sass-pub - build sass files without sourcemaps and only min files.

less - build less files. From sass folder to build folder.
less-pub - build less files without sourcemaps and only min files.

js - build js files. From js folder to build folder.
js-pub - build js files without sourcemaps and only min files.

css - build css files. From css folder to build folder.
css-pub - build css files without sourcemaps and only min files.

sync - start BrowserSync
watch - The Watch method is used to monitor your source files. When any changes to the source file is made, the watch will run an appropriate task.

build - Launches tasks: sass, less, css, js
build-pub - Launches tasks: sass-pub, less-pub, css-pub, js-pub

default task watch
*/

//config

//for BrowserSync         
var site = "wp-uikit.local";

// Path object
var p = {};

//Resulting file for concat js
p.resultJs = 'main.js';

//Resulting file for concat css
p.resultCss = 'main.css';

p.bower = './bower_components/';
p.node = './node_modules/';

p.dev = './src/'; //Custom (saas, js ...)
p.pub = './assets/'; //Build folder (min.css, css, js, js.min, ...)

p.devJs = p.dev + 'js/'; //js folder for developer
p.devSass = p.dev + 'sass/'; //sass folder for developer
p.devCss = p.dev + 'css/'; //sass folder for developer
p.devLess = p.dev + 'less/';

p.pubJs = p.pub + 'js/'; //js folder for assets
p.pubCss = p.pub + 'css/'; //css folder for assets


//Copying files for task Copy (from and to)
p.copy =  [     
    {   
        from: [p.bower + 'uikit/dist/js/*.min.js'],
        to: p.pubJs
    },
    { 
        from: [p.bower + 'uikit/src/scss/**/*.scss'],
        to: p.devSass + 'uikit/' 
    },
    { 
        from: [p.bower + 'uikit/src/less/**/*.less'],
        to: p.devLess + 'uikit/' 
    },
    { 
        from: [p.bower + 'uikit/dist/css/**/*.css'],
        to: p.pubCss + 'uikit/' 
    },
    { 
        from: [p.bower + 'uikit/dist/js/*.js', '!'+p.bower + 'uikit/dist/js/*.min.js'],
        to: p.devJs + 'uikit/' 
    }         
 ];


//Stream files

//Files for task sass
p.filesSass = [
    p.devSass + '/*.scss'
];

//Files for task less
p.filesLess = [
    p.devLess + '/*.less'
];

//Files for task Js. With order files. 
p.filesJs = [
    p.devJs + '**/*.js',
    '!'+ p.devJs + '**/*.min.js'
];

//Files for task css. With order files.
p.filesCss = [
    p.devCss + '**/*.css',
    '!'+ p.devCss+ '**/*.min.css'
];

// end config


// Defining requirements
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'), //Tracking errors
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    streamqueue  = require('streamqueue');

// Copy files
gulp.task('copy', function() {
    var index, len;
    for (index = 0, len = p.copy.length; index < len; ++index) {
        gulp.src(p.copy[index].from)
            .pipe(gulp.dest(p.copy[index].to));
    }
});

//Clean files in build folder
gulp.task('del', function() {
    del(p.pub);
});   


// Run:
// gulp build sass + sourcemaps 
gulp.task('sass', function () {
    return gulp.src(p.filesSass) 
        .pipe(plumber()) 
        .pipe(sourcemaps.init())
        .pipe(sass())  
        .pipe(autoprefixer(['last 3 version']))
        .pipe(sourcemaps.write())  
        .pipe(gulp.dest(p.pubCss))
        .pipe(csso({sourceMap: true})) 
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest(p.pubCss))
        .pipe(browserSync.reload());
});

// Run:
// gulp build sass (not sourcemaps) 
gulp.task('sass-pub', function () {
    return gulp.src(p.filesSass) 
        .pipe(plumber()) 
        .pipe(sass())  
        .pipe(autoprefixer(['last 3 version']))  
        .pipe(gulp.dest(p.pubCss))
        .pipe(csso({sourceMap: false})) 
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest(p.pubCss))
});

// gulp build less + sourcemaps 
gulp.task('less', function () {
    return gulp.src(p.filesLess) 
        .pipe(plumber()) 
        .pipe(sourcemaps.init())
        .pipe(less()) 
        .pipe(autoprefixer(['last 3 version']))
        .pipe(sourcemaps.write())  
        .pipe(gulp.dest(p.pubCss))
        .pipe(csso({sourceMap: true})) 
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest(p.pubCss))
        .pipe(browserSync.reload());

});

// gulp build less (not sourcemaps) 
gulp.task('less-pub', function () {
    return gulp.src(p.filesLess) 
        .pipe(plumber()) 
        .pipe(less())  
        .pipe(autoprefixer(['last 3 version'])) 
        .pipe(gulp.dest(p.pubCss))
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest(p.pubCss))
});


gulp.task('css', function () {
    streamqueue({ objectMode: true },
        gulp.src(p.filesCss)
            .pipe(autoprefixer(['last 3 version']))
            .pipe(gulp.dest(p.pubCss))
            .pipe(sourcemaps.init())
            .pipe(concat(p.resultCss))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(p.pubCss))
            .pipe(csso({sourceMap: true})) 
            .pipe(sourcemaps.write()) 
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(p.pubCss))
            .pipe(browserSync.reload())
    );
    streamqueue({ objectMode: true },
        gulp.src(p.filesCss)
            .pipe(autoprefixer(['last 3 version']))
            .pipe(sourcemaps.init())
            .pipe(csso({sourceMap: true})) 
            .pipe(rename({suffix: '.min'})) 
            .pipe(gulp.dest(p.pubCss))
            .pipe(browserSync.reload())
    );
});


gulp.task('css-pub', function () {
    streamqueue({ objectMode: true },
        gulp.src(p.filesCss)
            .pipe(autoprefixer(['last 3 version']))
            .pipe(concat(p.resultCss))
            .pipe(csso({sourceMap: true})) 
            .pipe(rename({suffix: '.min'})) 
            .pipe(gulp.dest(p.pubCss))
    );
    streamqueue({ objectMode: true },
        gulp.src(p.filesCss)
            .pipe(autoprefixer(['last 3 version']))
            .pipe(csso({sourceMap: true})) 
            .pipe(rename({suffix: '.min'})) 
            .pipe(gulp.dest(p.pubCss))
    );
});

// Run: 
// gulp scripts. 
// Uglifies and concat all JS files into one
gulp.task('js', function() {
    streamqueue({ objectMode: true },
        gulp.src(p.filesJs)
            .pipe(plumber())
            .pipe(gulp.dest(p.pubJs))
            .pipe(sourcemaps.init())
            .pipe(concat(p.resultJs))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(p.pubJs))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(p.pubJs))
            .pipe(browserSync.reload())
    );
    streamqueue({ objectMode: true },
        gulp.src(p.filesJs)
            .pipe(plumber())
            .pipe(uglify())
            .pipe(rename({suffix: '.min'})) 
            .pipe(gulp.dest(p.pubJs))
            .pipe(browserSync.reload())
    );
});

// Run: 
// gulp scripts. 
// Uglifies and concat all JS files into one with order
gulp.task('js-pub', function() {
    streamqueue({ objectMode: true },
        gulp.src(p.filesJs)
            .pipe(plumber())
            .pipe(concat(p.resultJs))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(p.pubJs))
    );
    streamqueue({ objectMode: true },
        gulp.src(p.filesJs)
            .pipe(plumber())
            .pipe(uglify())
            .pipe(rename({suffix: '.min'})) 
            .pipe(gulp.dest(p.pubJs))
    );
});

gulp.task('sync', function () {
    browserSync({
        proxy: site,
        notify: false
    });
});

gulp.task('watch', ['sync'], function () {
    gulp.watch(p.devSass + '**/*.scss', ['sass']);
    gulp.watch(p.devLess + '**/*.less', ['less']);
    gulp.watch(p.devCss + '**/*.css', ['css']);
    gulp.watch(p.devJs + '**/*.js', ['js']);
    
    gulp.watch('**/*.php', browserSync.reload);
    gulp.watch('**/*.html', browserSync.reload);
});

// build task
gulp.task('build', ['sass','less','css', 'js']);

// build task for public
gulp.task('build-pub', ['sass-pub','less-pub','css-pub', 'js-pub']);

// default task
gulp.task('default', ['watch']);


// To do
// imagemin = require('gulp-imagemin'),
//     pngquant = require('imagemin-pngquant'),
// gulp.task('img', function () {
//     gulp.src(path.src.img) 
//         .pipe(imagemin({ 
//             progressive: true,
//             svgoPlugins: [{removeViewBox: false}],
//             use: [pngquant()],
//             interlaced: true
//         }))
//         .pipe(gulp.dest(path.build.img)) //И бросим в build
//         .pipe(reload({stream: true}));
// });