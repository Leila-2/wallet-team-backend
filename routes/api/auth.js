const express = require("express");

const { authenticate, controllerWrapper } = require("../../middlewares");
const { auth } = require("../../controllers");
const router = express.Router();

router.post("/signup", controllerWrapper(auth.signup));

router.post("/login", controllerWrapper(auth.login));

router.get("/current", authenticate, controllerWrapper(auth.current));

router.get("/logout", authenticate, controllerWrapper(auth.logout));

module.exports = router;
