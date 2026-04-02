const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser() {
  try {
    const email = 'claudeniyomugabo2022@gmail.com';
    const password = 'claude@12345';
    const name = 'Claude Niyomugabo';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      console.log('You can now login with:', email, 'and password: claude@12345');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    console.log('User created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('You can now login with these credentials.');

  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
