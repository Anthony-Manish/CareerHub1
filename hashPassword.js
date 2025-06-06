const bcrypt = require('bcrypt');

async function generateHashedPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed Password: ${hashedPassword}`);
}

generateHashedPassword('manish'); // Replace with your desired password
