const {UserModel} = require("../../models");
const findByPkUser = async (req, res, next, userId) => {
    try {
        const user = await UserModel.findByPk(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        req.user = user; // Attach the user to the request object
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {findByPkUser}