'use strict';

module.exports = app => {

    const serveStatic = require('serve-static');
    const path = require('path');

    /*
    *   static files
    */

    app.use(serveStatic(path.join(__dirname, '../app/public')));

    /*
    *   middlewares
    */

    app.use((req, res, next) => {
        res.removeHeader('X-Powered-By');
        next();
    });

    /*
    *   routes
    */

    const index = require('../app/routes/index');
    const stream = require('../app/routes/stream');

    app.use('/', index);
    app.use('/stream', stream);


    /*
    *   error handlers
    */

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}