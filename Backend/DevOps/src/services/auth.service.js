import logger from '../config/logger.js';
import bcrypt from 'bcrypt';
import { db } from '../config/database.js';
import { eq } from 'drizzle-orm';
import { users } from '../models/users.js';

// Function to hash a password using bcrypt
export const hashPassword = async password => {
  try {
    // Hash the password with a salt round of 10
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw new Error('Could not hash password');
  }
};

// Function to compare a plain text password with a hashed password
export const comparePassword = async (password, hashedPassword) => {
  try {
    // Compare the provided password with the stored hashed password
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Error comparing passwords:', error);
    throw new Error('Could not compare passwords');
  }
};

// Function to create a user
export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    // check if user with the same email already exists
    const existingUser = db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // if user exists, throw an error
    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // hash the password before storing it
    const passwordHash = await hashPassword(password);

    // insert the new user into the database
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: passwordHash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    // log the successful creation of a user
    logger.info(`User with email ${email} created successfully`);
  } catch (error) {
    logger.error('Error creating user:', error);
    throw new Error('Could not create user');
  }
};

// function to authenticate a user
export const authenticateUser = async ({ email, password }) => {
  try {
    // find the user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // if user not found, throw an error
    if (!user) {
      throw new Error('User not found');
    }

    // compare the provided password with the stored hashed password
    const isPasswordValid = await comparePassword(password, user.password);

    // if password is invalid, throw an error
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // log the successful authentication of a user
    logger.info(`User with email ${user.email} authenticated successfully`);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  } catch (error) {
    logger.error('Error authenticating user:', error);
    throw new Error('Could not authenticate user');
  }
};
