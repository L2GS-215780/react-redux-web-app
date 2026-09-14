const MessageBoard = require("../controllers/message.board.controller");
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

//CREATE MESSAGE BOARD ROUTES
router.post('/create-message-board/', authMiddleware, MessageBoard.create);
/* */
//READ MESSAGE BOARD ROUTES
router.get('/retrieve-message-boards/', authMiddleware, MessageBoard.retrieveAll);
router.get('/retrieve-message-board/:id', authMiddleware, MessageBoard.findById);
router.get('/search-filter-message-board/', authMiddleware, MessageBoard.findBySearchAndFilter);
/* */
//UPDATE MESSAGE BOARD ROUTES

/* */
//DELETE MESSAGE BOARD ROUTES

/* */

module.exports = router;