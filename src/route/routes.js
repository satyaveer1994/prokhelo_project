const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { authenticaiton } = require("../middelwear/auth");

router.post("/createProfile", userController.createProfile);
// user Login
router.post("/loginUser", userController.loginUser);

router.get("/allUser", authenticaiton, userController.getUser);

router.put("/user/:userId", authenticaiton, userController.updateUser);

// ...

// routes will go here
// ...

module.exports = router;
