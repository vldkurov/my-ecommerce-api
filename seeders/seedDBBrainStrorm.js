const {faker} = require('@faker-js/faker');
const {UserModel, sequelize} = require('../models'); // Adjust the path as necessary

const seedUsers = async () => {
    const userData = [];

    for (let i = 0; i < 100; i++) { // Change with the number of rows you want to add
        const user = {
            email: faker.internet.email(),
            password: faker.internet.password(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        };
        userData.push(user);
    }

    console.log('userData', userData);

    try {
        // await sequelize.sync({force: true});
        const createdUsers = await UserModel.bulkCreate(userData);
        console.log('Number of users created : ', createdUsers.length);
    } catch (error) {
        console.log('There was a problem seeding the users', error);
    }

    // UserModel.findAll().then(users => console.log(users));
};

seedUsers();