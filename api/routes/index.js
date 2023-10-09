const express = require('express');

const notificationsRouter = require('./notifications.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/notifications', notificationsRouter);
}

module.exports = routerApi;