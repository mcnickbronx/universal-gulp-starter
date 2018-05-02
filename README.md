# universal-gulp-starter
gulp starter universal Support for universal config settings.

Configure constants for yourself (paths, file names, etc.)
Supports sorting when gluing

## Tasks

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

## Install
Save files in project folder
gulpfile.js
package.json

Run npm -i

Customize your gulpfile.js

## For Russian

Это универсальный gulp файл, который можно использовать в разных проектах. С поддержкой config, что бы легко можно было настраивать таски под свои проекты.
Настройте переменные в файле gulpfile.js
