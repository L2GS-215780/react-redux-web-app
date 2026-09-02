const express = require("express");
const router = express.Router();
const UserAccount = require("../controllers/user.accounts.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

//CREATE USER ACCOUNTS ROUTES
router.post('/create-account/', UserAccount.create);
/* */

//READ USER ACCOUNTS ROUTES
router.post('/login-user', UserAccount.login);
router.post('/logout-user', UserAccount.logout);

/* */

//UPDATE USER ACCOUNTS ROUTES

/* */

//DELETE USER ACCOUNTS ROUTES

/* */

module.exports = router;