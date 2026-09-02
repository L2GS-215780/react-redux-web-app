'use strict'

const UserAccount = require("../models/user.accounts.model");
const { hashPassword } = require("../utils/encryption-utils/bcrypt-utils");
const { encryptField, decryptField } = require("../utils/encryption-utils/crypto-utils");

//CREATE USER ACCOUNTS CONTROLLERS
exports.create = async function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({
            error: true,
            message: "Please provide all required fields"
        });
    }

    try {
        const new_user_account = new UserAccount(req.body);

        const hashedPassword = await hashPassword(new_user_account.password);

        const encryptedUserAccount = {
            first_name: encryptField(new_user_account.first_name),
            last_name: encryptField(new_user_account.last_name),
            user_name: encryptField(new_user_account.user_name),
            password: hashedPassword
        };

        UserAccount.create(encryptedUserAccount, function (err, newUser) {
            if (err) {
                return res.send(err);
            }
            return res.json({
                error: true,
                message: "User account created successfully",
                data: newUser
            });
        });
    } catch (error) {
        return res.status(500).send({ 
            error: true, 
            message: error.message
        });
    }
};
/* */

//READ USER ACCOUNTS CONTROLLERS

/* */

//UPDATE USER ACCOUNTS CONTROLLERS

/* */

//DELETE USER ACCOUNTS CONTROLLERS

/* */