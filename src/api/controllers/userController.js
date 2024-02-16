const bcrypt = require('bcryptjs');
const {sequelize, UserModel} = require("../../models");

exports.registerUser = async (req, res) => {
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

        // Respond with success (consider excluding sensitive information)
        res.status(201).json({
            UserModelId: newUser.UserModelId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        });

    } catch (error) {
        console.error('Error registering UserModel:', error);
        res.status(500).send('Server error');
    }
};
