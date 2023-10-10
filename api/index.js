const express = require('express');
const cors = require('cors');
const connection = require('./database/config');
const routerApi = require('./routes');
const { join } = require('node:path');
const http = require('http');
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');
const global = require("./global/global");
const helper = require("./helpers/helper");
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

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

global.io = io;

let onlineUsers = [];
io.on('connection', async(socket) => {
    console.log('Connected socket');
    /*
        socket.on('newConnectionUser', (user_id) => {
            if (!onlineUsers.some(item => item.user_id == user_id)) {
                onlineUsers.push({
                    user_id: user_id,
                    socket_id: socket.id
                });
                io.emit('getOnlineUsers', onlineUsers);
            }
        });

        socket.on('disconnect', () => {
            onlineUsers = onlineUsers.filter(item => item.socket_id != socket.id);
            io.emit('getOnlineUsers', onlineUsers);
        });
    */

});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
    sessionData = session;
    console.log('aquii', session);
});


client.on('ready', async(me) => {
    console.log('Client is ready!');
    let chat_activos = await client.getChats();
    console.log('chat', chat_activos[0]);
    console.log('chat', chat_activos[4]);
});

client.on('message_create', async(message) => {
    const { id, from, to, body, timestamp, _data, isStatus, hasMedia } = message;
    //console.log(message);
    if (isStatus) {
        return;
    }
    let message_obj = {
        remote: id.remote,
        remote_name: _data.notifyName,
        from: from,
        to: to,
        body: body,
        status: id.fromMe
    };
    await helper.apiRequest('post', '/messages')


});


client.initialize();

server.listen(port, () => {
    console.log('Running server');
});