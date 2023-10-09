const express = require('express');

const router = express.Router();

router.post('/notifications', (req, res) => {
    console.log("req: ", req.body)
    io.emit('notification', {
        notification: req.body
    })
    res.status(200).json({ message: "Solicitud procesada con éxito" });
});


module.exports = router;