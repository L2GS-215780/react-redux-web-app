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
router.put('/update-message-board/:id', authMiddleware, MessageBoard.update);
/* */

//DELETE MESSAGE BOARD ROUTES
router.put('/archive-message-board/:id', authMiddleware, MessageBoard.archive);
router.put('/unarchive-message-board/:id', authMiddleware, MessageBoard.unarchive);
router.delete('/delete-message-board/:id', authMiddleware, MessageBoard.delete);
router.patch('/archive-message-boards/', authMiddleware, MessageBoard.archives);
router.patch('/unarchive-message-boards/', authMiddleware, MessageBoard.unarchives);
router.delete('/delete-message-boards/', authMiddleware, MessageBoard.deletes);
/* */

module.exports = router;