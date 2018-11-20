// v.1.4.0

/*

Universal-gulp-starter
https://github.com/mcnickbronx/universal-gulp-starter

Николай Плотников
Plotnikov.Site

Это универсальный gulp файл, который можно использовать в разных проектах. Поддерживает основные типичные задачи для разработчика.
С поддержкой config (набор переменных), что бы легко можно было настраивать таски под свои проекты.
Настройте переменные (пути, размер катинок и т.д.) в файле gulpfile.js


Задачи:
copy - Автоматическое копирование нужных файлов для работы. Используется массив объектов (p.copy) От куда и Куда.
del - Удалить файлы из папки публикации p.pub (путь настраиватеся в переменных).

sass - компиляция sass файлов в папку для build файлов (Настраивается в p.pub). css и css.min
sass-pub - финальная компиляция sass без отладочных файлов sourcemaps и только css.min. 

less - компиляция less файлов в папку для build файлов (Настраивается в p.pub). css и css.min
less-pub - финальная компиляция less без отладочных файлов sourcemaps и без css.min.

js - сбор и сжатие js файлов. Поддерживается порядок сборки файлов. То есть какой файл идет первым, вторым и т.д.
js-pub - сборка файлов js без sourcemaps и только min файлы.  Поддерживается порядок сборки файлов. То есть какой файл идет первым, вторым и т.д.

css - сжатие css.  Поддерживается порядок сборки файлов. То есть какой файл идет первым, вторым и т.д.
css-pub - сжатие css без sourcemaps и только min файлы.  Поддерживается порядок сборки файлов. То есть какой файл идет первым, вторым и т.д.

sync - стартуем BrowserSync
watch - Метод Watch используется для контроля ваших исходных файлов. Когда будут сделаны какие-либо изменения в исходном файле, Watch будет запускать соответствующую задачу.

build - запуск задач: sass, less, css, js
build-pub - запуск задач: sass-pub, less-pub, css-pub, js-pub

img - сжатие и ресайз картинок до максимальной ширины и высоты (настраивается в переменных)
tinypng - tinypng - сжатие с плагином for TinyPNG (tinypng.com)

таск по умолчанию watch
*/

//настройки

var site = "wp-uikit.local"; //Для BrowserSync урл локального сайта

var p = {}; // Объекты путей

p.resultJs = 'main.js'; //Общий файл js для конкатинации разных js из папки p.dev

p.resultCss = 'main.css'; //Общий файл для конкантинации css из папки p.dev

p.bower = './bower_components/'; //Папка для bower
p.node = './node_modules/'; //Папка node

p.dev = './src/'; //Папка исходных файлов (saas, less, js ...)
p.pub = './assets/'; //Папка для сборки файлов (min.css, css, js, js.min, ...)

p.devJs = p.dev + 'js/'; //папка js ресурсов
p.devSass = p.dev + 'sass/'; //папка sass ресурсов
p.devCss = p.dev + 'css/'; //папка css файлов
p.devLess = p.dev + 'less/'; //папка less файлов

p.pubJs = p.pub + 'js/'; //js папка для сборки
p.pubCss = p.pub + 'css/'; //css папка для сборки

p.devImg = p.dev + 'img/'; 
p.pubImg = './img/';

//Для обработки изображений
img = {}
img.width = 1200;
img.height = 800; 
img.API_KEY = ''; //Ключ для TinyPNG

//Копирование нужных файлов (from and to)
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
    // { 
    //     from: [p.bower + 'uikit/dist/css/**/*.css'],
    //     to: p.pubCss + 'uikit/' 
    // },
    // { 
    //     from: [p.bower + 'uikit/dist/js/*.js', '!'+p.bower + 'uikit/dist/js/*.min.js'],
    //     to: p.devJs + 'uikit/' 
    // }         
 ];


//Файлы для таксков

//Файлы sass
p.filesSass = [
    p.devSass + '/*.scss'
];

//Файлы less
p.filesLess = [
    p.devLess + '/*.less'
];

//Js. Поддерживается сортировка, то есть порядок сборки файлов. 
p.filesJs = [
    p.devJs + '**/*.js',
    '!'+ p.devJs + '**/*.min.js'
];

//Файлы css с поддержкой сортировки. То есть порядок сборки файлов.
p.filesCss = [
    p.devCss + '**/*.css',
    '!'+ p.devCss+ '**/*.min.css'
];

p.filesImg = [
    p.devImg + '**/*.png',
    p.devImg + '**/*.jpg',
    p.devImg + '**/*.gif',
    p.devImg + '**/*.jpeg'
];

// end config


// Подключаемые модули
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    streamqueue  = require('streamqueue'),
    imagemin    = require('gulp-imagemin'),
    imageResize = require('gulp-image-resize'), //needed http://www.graphicsmagick.org/
    //pngquant    = require('imagemin-pngquant'),
    //imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    tingpng = require('gulp-tinypng'); 

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
        .pipe(browserSync.reload({stream:true}));
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
        .pipe(browserSync.reload({stream:true}));

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
            .pipe(browserSync.reload({stream:true}))
    );
    streamqueue({ objectMode: true },
        gulp.src(p.filesCss)
            .pipe(autoprefixer(['last 3 version']))
            .pipe(sourcemaps.init())
            .pipe(csso({sourceMap: true})) 
            .pipe(rename({suffix: '.min'})) 
            .pipe(gulp.dest(p.pubCss))
            .pipe(browserSync.reload({stream:true}))
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
            .pipe(browserSync.reload({stream:true}))
    );
    streamqueue({ objectMode: true },
        gulp.src(p.filesJs)
            .pipe(plumber())
            .pipe(uglify())
            .pipe(rename({suffix: '.min'})) 
            .pipe(gulp.dest(p.pubJs))
            .pipe(browserSync.reload({stream:true}))
    );
});

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

gulp.task('build', ['sass','less','css', 'js']);

gulp.task('build-pub', ['sass-pub','less-pub','css-pub', 'js-pub']);

gulp.task('default', ['watch']);

gulp.task('img', function() {
     gulp.src(p.filesImg)
        .pipe(imageResize({
            width : img.width,
            height : img.height
        }))
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 3,
            svgoPlugins: [{removeViewBox: false}],
            use: [ /* плагины для более тонкой настройки
                    pngquant({optimizationLevel: 3}),
                    pngquant({
                        verbose: "true",
                        quality: '50-65',
                        speed: 1
                    }),
                    imageminJpegRecompress({
                        loops: 5,
                        min: 65,
                        max: 70,
                        quality:'medium'
                    })*/
                ], 
        }))
        .pipe(gulp.dest(p.pubImg)); // Выгружаем на продакшен
});

gulp.task('tinypng', function () {
    gulp.src(p.filesImg)
        .pipe(imageResize({
            width : img.width,
            height : img.height
        }))
        .pipe(tingpng(img.API_KEY))
        .pipe(gulp.dest(p.pubImg));
});