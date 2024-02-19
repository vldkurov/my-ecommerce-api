const {UserModel} = require("../src/models");

async function setAdmin(userId) {
    try {
        const user = await UserModel.findByPk(userId);
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`Пользователь ${user.email} теперь администратор.`);
        } else {
            console.log('Пользователь не найден.');
        }
    } catch (error) {
        console.error('Ошибка при назначении прав администратора:', error);
    }
}

// Использование функции
setAdmin(1).then(() => console.log(`User set role 'admin'`)).catch(err => console.error(err));
