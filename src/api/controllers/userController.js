const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config').development; // Or dynamically determine the environment
const {sequelize, UserModel} = require("../../models");

const registerUser = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Check if the UserModel already exists
        const userExists = await UserModel.findOne({
            where: {email: email},
            transaction: transaction
        });
        if (userExists) {
            await transaction.rollback();
            return res.status(400).json({message: 'User already exists'});
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the UserModel
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }, {transaction});

        await transaction.commit();

        // After successful registration, issue a JWT
        const payload = {userId: newUser.userId}; // Adjust according to your user model
        const token = jwt.sign(payload, config.jwt_secret, {expiresIn: '1d'});

        // Respond with success (consider excluding sensitive information)
        res.status(201).json({
            UserModelId: newUser.UserModelId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            token: `Bearer ${token}`
        });

    } catch (error) {
        console.error('Error registering UserModel:', error);
        res.status(500).send('Server error');
    }
};

const loginUser = async (req, res) => {

    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({where: {email}});
        if (!user) {
            return res.status(401).json({message: 'Authentication failed. User not found.'});
        }

        bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error;

            if (isMatch) {
                const payload = {userId: user.userId}; // Customize payload as needed
                const token = jwt.sign(payload, config.jwt_secret, {expiresIn: '1h'});

                return res.json({message: 'Authentication successful', token: 'Bearer ' + token});
            } else {
                return res.status(401).json({message: 'Authentication failed. Wrong password.'});
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

const logoutUser = async (req, res) => {
    // Inform the client to clear the JWT
    // Note: Actual token invalidation should happen client-side by removing the token from storage
    res.json({message: 'Log out successful. Please remove the token on the client side.'});
}

module.exports = {registerUser, loginUser, logoutUser};
