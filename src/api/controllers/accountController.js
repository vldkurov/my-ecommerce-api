const {UserModel} = require("../../models");
const getAllUsers = async (req, res) => {
    try {
        const queryOptions = {
            attributes: {exclude: ['password']},
        };
        const users = await UserModel.findAll(queryOptions);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
}

const getUserByID = async (req, res) => {
    const {userId} = req.params;
    // Check if the requested userId matches the logged in user's id or if the user is an admin
    if (req.user.userId === parseInt(userId) || req.user.role === 'admin') {
        try {
            const user = await UserModel.findOne({
                where: {userId: userId},
                attributes: {exclude: ['password']}
            });
            if (user) {
                res.json(user);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(403).send('Access denied');
    }
}

const updateUserByID = async (req, res) => {
    const {userId} = req.params;
    let {name, email, role, ...otherFields} = req.body; // Extract role separately

    // If the current user is not an admin and tries to update the role, ignore the role change or return an error
    if (req.user.role !== 'admin') {
        if (role) {
            // Option 1: Ignore the role change and proceed with other updates
            console.log('Non-admin users are not allowed to change roles. Ignoring role update.');
            role = undefined; // Ignore role update by setting it to undefined

            // Option 2: Return an error message (uncomment the next two lines to use this option)
            // return res.status(403).json({ message: "Only admins can change user roles." });
        }
    }

    try {
        // Proceed with the update, including role if the user is an admin
        const valuesToUpdate = Object.assign({}, name && {name}, email && {email}, role && {role}, otherFields);
        const [updated] = await UserModel.update(valuesToUpdate, {where: {userId: userId}});

        if (updated) {
            const updatedUser = await UserModel.findByPk(userId, {
                attributes: {exclude: ['password']} // Optionally exclude sensitive fields
            });
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {getAllUsers, getUserByID, updateUserByID}