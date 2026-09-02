'use strict'

const UserAccount = require("../models/user.accounts.model");
const { hashPassword } = require("../utils/encryption-utils/bcrypt-utils");
const { encryptField, decryptField } = require("../utils/encryption-utils/crypto-utils");
const { generateAccessToken, generateRefreshToken } = require("../utils/encryption-utils/jwt-utils");

//CREATE USER ACCOUNTS CONTROLLERS
exports.create = async function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({
            error: true,
            message: "Please provide all required fields"
        });
    }

    UserAccount.findByUsername(req.body.user_name, async function (err, existingUser) {
        if (err) {
            return res.status(500).send(err);
        }

        if (existingUser) {
            return res.status(409).json({
                error: true,
                message: "User account already exists"
            });
        }

        try {
            const new_user_account = new UserAccount(req.body);

            const hashedPassword = await hashPassword(new_user_account.password);

            const encryptedUserAccount = {
                first_name: encryptField(new_user_account.first_name),
                last_name: encryptField(new_user_account.last_name),
                user_name: new_user_account.user_name,
                password: hashedPassword,
                user_role: new_user_account.user_role,
                is_active: 1
            };


            UserAccount.create(encryptedUserAccount, function (err, insertId) {
                if (err) {
                    return res.status(500).send(err);
                }

                const payload = {
                    id: insertId,
                    user_role: new_user_account.user_role
                };

                const accessToken = generateAccessToken(payload);
                const refreshToken = generateRefreshToken(payload);

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 24 * 60 * 60 * 1000
                });

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                return res.status(201).json({
                    error: false,
                    message: "User account created successfully",
                    data: {
                        id: insertId,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                });
            });
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error.message
            });
        }
    });
};
/* */

//READ USER ACCOUNTS CONTROLLERS
exports.login = function (req, res) {

};

exports.logout = function (req, res) {

};

/* */

//UPDATE USER ACCOUNTS CONTROLLERS

/* */

//DELETE USER ACCOUNTS CONTROLLERS

/* */