function isAdmin(req, res, next) {
    // Проверяем, аутентифицирован ли пользователь и является ли он администратором
    if (req.user && req.user.role === 'admin') {
        next(); // Пользователь аутентифицирован и обладает правами администратора
    } else {
        res.status(403).json({message: "Access denied. Administrator rights required."});
    }
}

module.exports = {isAdmin};
