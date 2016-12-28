'use strict';

module.exports = function(gulp, $, paths, config, Logger) {
    gulp.task(config.task.start, ' - start serwera aplikacji', [config.task.watch], function () {
        $.connect.server({
            root: './demo',
            livereload: true
        });
    });
};