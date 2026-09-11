'use strict'

const UserAccount = require("../models/user.accounts.model");
const { hashPassword, comparePassword } = require("../utils/encryption-utils/bcrypt-utils");
const { encryptField, decryptField } = require("../utils/encryption-utils/crypto-utils");
const { generateAccessToken, generateRefreshToken } = require("../utils/encryption-utils/jwt-utils");

//CREATE USER ACCOUNTS CONTROLLERS
exports.create = async function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({
            error: true,
            message: "Please provide all required fields"
        });
    } else {
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


            UserAccount.create(encryptedUserAccount, function (err, userInsertId) {
                if (err) {
                    return res.status(500).send(err);
                }

                const payload = {
                    id: userInsertId,
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
                        id: userInsertId,
                        user_name: new_user_account.user_name,
                        user_role: new_user_account.user_role
                    }
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

//READ USER ACCOUNTS CONTROLLERS
exports.login = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({
            error: true,
            message: "Please provide all required fields"
        });
    }

    const { user_name, password } = req.body;

    UserAccount.login(user_name, async function (err, user) {
        if (err) {
            return res.status(500).send(err);
        }

        if (!user) {
            return res.status(401).json({
                error: true,
                message: "Invalid username or password"
            });
        }

        try {
            const isMatch = await comparePassword(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    error: true,
                    message: "Invalid username or password"
                });
            }

            const payload = {
                id: user.id,
                user_role: user.user_role
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

            return res.status(200).json({
                error: false,
                message: "Login successful"
            });
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: error.message
            });
        }
    });
};

exports.logout = function (req, res) {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    return res.status(200).json({
        error: false,
        message: "Logout successful"
    });
};

exports.retrieveAll = function (req, res) {
    UserAccount.retrieveAll(function (err, userAccounts) {
        if (err) {
            return res.status(500).send(err);
        }

        const decryptUserAccounts = userAccounts.map(users => ({
            id: users.id,
            first_name: decryptField(users.first_name),
            last_name: decryptField(users.last_name),
            user_name: users.user_name,
            user_role: users.user_role,
            is_active: users.is_active,
            created_at: users.created_at,
            updated_at: users.updated_at
        }));

        return res.status(200).json({
            error: false,
            message: "Retrieve all user accounts",
            data: decryptUserAccounts
        });
    });
};

exports.findById = function (req, res) {
    UserAccount.findById(req.params.id, function (err, userAccount) {
        if (err) {
            return res.status(500).send(err);
        }

        if (!userAccount) {
            return res.status(404).json({
                error: true,
                message: "No user account found"
            });
        }

        const decryptUserAccount = {
            id: userAccount.id,
            first_name: decryptField(userAccount.first_name),
            last_name: decryptField(userAccount.last_name),
            user_name: userAccount.user_name,
            user_role: userAccount.user_role,
            is_active: userAccount.is_active,
            created_at: userAccount.created_at,
            updated_at: userAccount.updated_at
        };

        return res.status(200).json({
            error: false,
            message: "Retrieve user account",
            data: decryptUserAccount
        });
    });
};

exports.findBySearchAndFilter = function (req, res) {
    const {
        user_role,
        is_active,
        created_at,
        search_name
    } = req.query;

    const filters = {
        user_role,
        is_active: is_active !== undefined ? Number(is_active) : undefined,
        created_at: created_at || undefined
    };

    UserAccount.findBySearchAndFilter(filters, function (err, userAccounts) {
        if (err) {
            return res.status(500).send(err);
        }

        let decryptUserAccounts = userAccounts.map(users => ({
            id: users.id,
            first_name: decryptField(users.first_name),
            last_name: decryptField(users.last_name),
            user_name: users.user_name,
            user_role: users.user_role,
            is_active: users.is_active,
            created_at: users.created_at,
            updated_at: users.updated_at
        }));

        if (search_name && search_name.trim() !== "") {
            const keywords = search_name.toLowerCase().trim();

            decryptUserAccounts = decryptUserAccounts.filter(users =>
                (users.first_name && users.first_name.toLowerCase().includes(keywords)) ||
                (users.last_name && users.last_name.toLowerCase().includes(keywords)) ||
                (users.user_name && users.user_name.toLowerCase().includes(keywords))
            );
        };

        return res.status(200).json({
            error: false,
            message: "Retrieve user accounts",
            data: decryptUserAccounts
        });
    });
};

/* */

//UPDATE USER ACCOUNTS CONTROLLERS

/* */

//DELETE USER ACCOUNTS CONTROLLERS
exports.activateUserAccount = function (req, res) {
    UserAccount.activateUserAccount(req.params.id, function (err, userAccount) {
        if (err) {
            return res.status(500).send(err);
        }

        if (!userAccount) {
            return res.status(404).json({
                error: true,
                message: "No user account found"
            });
        }

        return res.status(200).json({
            error: false,
            message: "User account activated successfully",
        });
    });
};

exports.deactivateUserAccount = function (req, res) {
    UserAccount.deactivateUserAccount(req.params.id, function (err, userAccount) {
        if (err) {
            return res.status(500).send(err);
        }

        if (!userAccount) {
            return res.status(404).json({
                error: true,
                message: "No user account found"
            });
        }

        return res.status(200).json({
            error: false,
            message: "User account deactivated successfully",
        });
    });
};

exports.delete = function (req, res) {
    UserAccount.delete(req.params.id, function (err, userAccount) {
        if (err) {
            return res.status(500).send(err);
        }

        if (!userAccount) {
            return res.status(404).json({
                error: true,
                message: "No user account found"
            });
        }

        return res.status(200).json({
            error: false,
            message: "User account deleted successfully",
        });
    });
};

/* */