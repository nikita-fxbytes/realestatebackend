require('dotenv').config();
const connectToMongo = require('./db');
const Role = require('./models/Role');
const User = require('./models/User');

const bcrypt = require('bcryptjs');
const seedData = async () => {
  try {
    await connectToMongo();

    const roles = [
      {
        name: 'admin',
        status: 1, // Set the status to 1 for active
      },
      {
        name: 'customer',
        status: 1, // Set the status to 1 for active
      },
      {
        name: 'realtor',
        status: 1, // Set the status to 1 for active
      }
    ];

    const createdRoles = await Role.create(roles);
    //Store password encyp form
    const salt = await bcrypt.genSalt(10);
    const setSecurePassword = await bcrypt.hash('Qwerty@1', salt);
    //End
    const users = [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        mobile:9988776657,
        password: setSecurePassword,
        roleId: createdRoles[0]._id,
        status: 1, // Set the status to 1 for active
      }
    ];

    await User.create(users);

    process.exit(); // terminate the script after seeding data
  } catch (err) {
    process.exit(1); // terminate the script with error status
  }
};

seedData();