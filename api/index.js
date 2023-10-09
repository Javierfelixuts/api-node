const express = require('express');
const cors = require('cors');
const connection = require('./database/config');
const routerApi = require('./routes');
const { join } = require('node:path');
const http = require('http');
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const whitelist = ['*'];
const options = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('no permitido'));
        }
    }
}
app.use(cors(options));

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({ message: "API NODE" });
});

var server = http.createServer(app);
var io = require('socket.io')(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: '*',
    }
});


server.listen(port, () => {
    console.log('Running server');
});