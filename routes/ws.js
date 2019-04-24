//It works with routers, too, this time at /ws-stuff/echo:
const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");

router.get("/chat", ensureLogin.ensureLoggedIn(), async (req, res, next) => {
    const isLoggedIn = req.user ? true : false;
    res.render("chat", { isLoggedIn: isLoggedIn });
});
router.ws("/message", function(ws, req) {
    ws.on("message", function(msg) {
        ws.send(msg);
    });
});

module.exports = router;
