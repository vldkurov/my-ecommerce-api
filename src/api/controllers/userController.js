const bcrypt = require('bcryptjs');
const {sequelize, UserModel} = require("../../models");
const {generateToken, handleServerError, handleAuthenticationError} = require("../../utils");


const registerUser = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    const transaction = await sequelize.transaction();
    try {
        const userExists = await UserModel.findOne({where: {email}, transaction});
        if (userExists) {
            await transaction.rollback();
            return res.status(400).json({message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }, {transaction});

        await transaction.commit();

        const token = generateToken(newUser.userId);
        res.status(201).json({
            token: `Bearer ${token}`,
            userId: newUser.userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email
        });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        handleServerError(error, res);
    }
};


const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({where: {email}});
        if (!user) {
            return handleAuthenticationError(res, 'Authentication failed. User not found.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return handleAuthenticationError(res, 'Authentication failed. Wrong password.');
        }

        const token = generateToken(user.userId);
        res.json({message: 'Authentication successful', token: 'Bearer ' + token});
    } catch (error) {
        handleServerError(error, res);
    }
};

const logoutUser = async (req, res) => {
    res.json({message: 'Log out successful. Please remove the token on the client side.'});
};

module.exports = {registerUser, loginUser, logoutUser};
