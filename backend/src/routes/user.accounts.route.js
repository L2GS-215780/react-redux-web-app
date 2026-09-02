const express = require("express");
const router = express.Router();
const UserAccount = require("../controllers/user.accounts.controller");

//CREATE USER ACCOUNTS ROUTES
router.post('/create-account/', UserAccount.create);
/* */

//READ USER ACCOUNTS ROUTES

/* */

//UPDATE USER ACCOUNTS ROUTES

/* */

//DELETE USER ACCOUNTS ROUTES

/* */

module.exports = router;