const MessageBoard = require("../models/message.board.model");
const UserAccount = require("../models/user.accounts.model");
const { encryptField, decryptField } = require("../utils/encryption-utils/crypto-utils");

//CREATE MESSAGE BOARD CONTROLLER
exports.create = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({
            error: true,
            message: "Please provide all required fields"
        });
    } else {
        try {
            const new_message_board = new MessageBoard(req.body);

            const encryptMessageBoard = {
                user_id_fk: new_message_board.user_id_fk,
                title: encryptField(new_message_board.title),
                description: encryptField(new_message_board.description),
                is_deleted: 0
            };

            UserAccount.findById(new_message_board.user_id_fk, function (err, userAccount) {
                if (err) {
                    return res.status(500).send(err);
                }

                if (!userAccount) {
                    return res.status(404).json({
                        error: true,
                        message: "User does not exist"
                    });
                }

                MessageBoard.create(encryptMessageBoard, function (err, messageBoardId) {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    return res.status(201).json({
                        error: false,
                        message: "Message board created successfully",
                        data: messageBoardId
                    });
                });
            });
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error.message
            });
        }
    }
};
/* */
//READ MESSAGE BOARD CONTROLLER
exports.retrieveAll = function (req, res) {
    MessageBoard.retrieveAll(function (err, messageBoards) {
        if (err) {
            return res.status(500).send(err);
        }

        const decryptMessageBoards = messageBoards.map(messages => {
            const user_full_name = [
                decryptField(messages.first_name) || "",
                decryptField(messages.last_name) || ""
            ].filter(Boolean).join(" ");

            return {
                id: messages.id,
                user_id_fk: messages.user_id_fk,
                user_name: messages.user_name,
                full_name: user_full_name,
                title: decryptField(messages.title),
                description: decryptField(messages.description),
                created_at: messages.created_at,
                updated_at: messages.updated_at
            };
        });

        return res.status(200).json({
            error: false,
            message: "Retrieve all message boards",
            data: decryptMessageBoards
        });
    });
};

exports.findById = function (req, res) {
    MessageBoard.findById(req.params.id, function (err, messageBoard) {
        if (err) {
            return res.status(500).send(err);
        }

        if (!messageBoard) {
            return res.status(404).json({
                error: true,
                message: "No message board found"
            });
        }

        const user_full_name = [
            decryptField(messageBoard.first_name) || "",
            decryptField(messageBoard.last_name) || ""
        ].filter(Boolean).join(" ");

        const decryptMessageBoards = {
            id: messageBoard.id,
            user_id_fk: messageBoard.user_id_fk,
            user_name: messageBoard.user_name,
            full_name: user_full_name,
            title: decryptField(messageBoard.title),
            description: decryptField(messageBoard.description),
            created_at: messageBoard.created_at,
            updated_at: messageBoard.updated_at
        };

        return res.status(200).json({
            error: false,
            message: "Retrieve message boards",
            data: decryptMessageBoards
        });
    });
};

exports.findBySearchAndFilter = function (req, res) {
    const {
        is_deleted,
        created_at,
        search_message_board
    } = req.query;

    const filters = {
        is_deleted: is_deleted !== undefined ? Number(is_deleted) : undefined,
        created_at: created_at || undefined
    };

    MessageBoard.findBySearchAndFilter(filters, function (err, messageBoard) {
        if (err) {
            return res.status(500).send(err);
        }

        if (!messageBoard) {
            return res.status(404).json({
                error: true,
                message: "No message board found"
            });
        }

        let decryptedMessageBoards = messageBoard.map(mb => {
            const user_full_name = [
                decryptField(mb.first_name),
                decryptField(mb.last_name)
            ].filter(Boolean).join(" ");

            return {
                id: mb.id,
                user_id_fk: mb.user_id_fk,
                user_name: mb.user_name,
                full_name: user_full_name,
                title: decryptField(mb.title),
                description: decryptField(mb.description),
                created_at: mb.created_at,
                updated_at: mb.updated_at
            };
        });

        if (search_message_board && search_message_board.trim() !== "") {
            const keyword = search_message_board.toLowerCase().trim();

            decryptedMessageBoards = decryptedMessageBoards.filter(mb =>
                (mb.title && mb.title.toLowerCase().includes(keyword)) ||
                (mb.description && mb.description.toLowerCase().includes(keyword))
            );
        }

        return res.status(200).json({
            error: false,
            message: "Retrieve message boards",
            data: decryptedMessageBoards
        });
    });
};
/* */
//UPDATE MESSAGE BOARD CONTROLLER

/* */
//DELETE MESSAGE BOARD CONTROLLER
exports.archive = function (req, res) {
    MessageBoard.archive(req.params.id, function (err, messageBoardAffectedRows) {
        if (err) {
            return res.status(500).send(err);
        }

        if (messageBoardAffectedRows.affectedRows === 0) {
            return res.status(404).json({
                error: true,
                message: "No message board found"
            });
        }

        return res.status(200).json({
            error: false,
            message: "Message board archived successfully",
        });
    });
};

exports.unarchive = function (req, res) {
    MessageBoard.unarchive(req.params.id, function (err, messageBoardAffectedRows) {
        if (err) {
            return res.status(500).send(err);
        }

        if (messageBoardAffectedRows.affectedRows === 0) {
            return res.status(404).json({
                error: true,
                message: "No message board found"
            });
        }

        return res.status(200).json({
            error: false,
            message: "Message board unarchived successfully",
        });
    });
};

exports.delete = function (req, res) {
    MessageBoard.delete(req.params.id, function (err, messageBoardAffectedRows) {
        if (err) {
            return res.status(500).send(err);
        }

        if (messageBoardAffectedRows.affectedRows === 0) {
            return res.status(404).json({
                error: true,
                message: "No message board found"
            });
        }

        return res.status(200).json({
            error: false,
            message: "Message board deleted successfully",
        });
    });
};

exports.archives = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({
            error: true,
            message: "Please provide all required IDs"
        });
    } else {
        try {
            const ids = req.body.ids;

            MessageBoard.archives(ids, function (err, result) {
                if (err) {
                    return res.status(500).send(err);
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        error: true,
                        message: "No message board found"
                    });
                }

                return res.status(200).json({
                    error: false,
                    message: "Message board archived successfully",
                });
            });

        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error.message
            });
        }
    }
};

exports.unarchives = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({
            error: true,
            message: "Please provide all required IDs"
        });
    } else {
        try {
            const ids = req.body.ids;

            MessageBoard.unarchives(ids, function (err, result) {
                if (err) {
                    return res.status(500).send(err);
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        error: true,
                        message: "No message board found"
                    });
                }

                return res.status(200).json({
                    error: false,
                    message: "Message board unarchived successfully",
                });
            });

        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error.message
            });
        }
    }
};

exports.deletes = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({
            error: true,
            message: "Please provide all required IDs"
        });
    } else {
        try {
            const ids = req.body.ids;

            MessageBoard.deletes(ids, function (err, result) {
                if (err) {
                    return res.status(500).send(err);
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        error: true,
                        message: "No message board found"
                    });
                }

                return res.status(200).json({
                    error: false,
                    message: "Message board deleted successfully",
                });
            });

        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error.message
            });
        }
    }
};

/* */