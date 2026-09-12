const express = require("express");
const router = express.Router();
const UserAccount = require("../controllers/user.accounts.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

//CREATE USER ACCOUNTS ROUTES
router.post('/create-account/', UserAccount.create);
/* */

//READ USER ACCOUNTS ROUTES
router.post('/login-account/', UserAccount.login);
router.post('/logout-account/', authMiddleware, UserAccount.logout);
router.get('/retrieve-accounts/', authMiddleware, UserAccount.retrieveAll);
router.get('/retrieve-account/:id', authMiddleware, UserAccount.findById);
router.get('/search-filter-account/', authMiddleware, UserAccount.findBySearchAndFilter);

/* */

//UPDATE USER ACCOUNTS ROUTES

/* */

//DELETE USER ACCOUNTS ROUTES
router.put('/activate-account/:id', authMiddleware, roleMiddleware(["Admin"]), UserAccount.activateUserAccount);
router.put('/deactivate-account/:id', authMiddleware, roleMiddleware(["Admin"]), UserAccount.deactivateUserAccount);
router.delete('/delete-account/:id', authMiddleware, roleMiddleware(["Admin"]), UserAccount.delete);
router.post('/activate-accounts/', authMiddleware, roleMiddleware(["Admin"]), UserAccount.activateUserAccounts);
router.post('/deactivate-accounts/', authMiddleware, roleMiddleware(["Admin"]), UserAccount.deactivateUserAccounts);
router.delete('/delete-accounts/', authMiddleware, roleMiddleware(["Admin"]), UserAccount.deletes);
/* */

module.exports = router;