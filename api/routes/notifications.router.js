const express = require('express');
const global = require("../global/global");

const router = express.Router();

router.post('/', (req, res) => {
    console.log("req: ", req.body)
    global.io.emit('notification', {
        notification: req.body
    });
    res.status(200).json({ message: "Solicitud procesada con éxito" });
});


module.exports = router;