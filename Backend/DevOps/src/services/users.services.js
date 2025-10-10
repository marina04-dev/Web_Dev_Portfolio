import logger from '#src/config/logger.js';
import { db } from '#src/config/database.js';
import { users } from '#src/models/users.js';
import { eq } from 'drizzle-orm';

// Function to get all users from the database
export const getAllUsers = async () => {
  try {
    // Fetch all users from the database
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);

    // return users
    return allUsers;
  } catch (error) {
    logger.error('Error fetching all users:', error);
    throw new Error('Could not fetch users');
  }
};

// function to get a user by ID
export const getUserById = async id => {
  try {
    // Fetch user by ID
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    // If user not found, throw an error
    if (!user) {
      throw new Error('User not found');
    }

    // return user
    return user;
  } catch (e) {
    logger.error(`Error getting user by id ${id}:`, e);
    throw e;
  }
};

// function to update a user by ID
export const updateUser = async (id, updates) => {
  try {
    // First check if user exists
    const existingUser = await getUserById(id);

    // Check if email is being updated and if it already exists
    if (updates.email && updates.email !== existingUser.email) {
      // Check if new email already exists
      const [emailExists] = await db
        .select()
        .from(users)
        .where(eq(users.email, updates.email))
        .limit(1);

      // If email exists, throw an error
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    // Add updated_at timestamp
    const updateData = {
      ...updates,
      updated_at: new Date(),
    };

    // Update user in the database
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    // Log the update action
    logger.info(`User ${updatedUser.email} updated successfully`);
    // return updated user
    return updatedUser;
  } catch (e) {
    logger.error(`Error updating user ${id}:`, e);
    throw e;
  }
};

// function to delete a user by ID
export const deleteUser = async id => {
  try {
    // First check if user exists
    await getUserById(id);

    // Delete user from the database
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    // Log the delete action
    logger.info(`User ${deletedUser.email} deleted successfully`);
    // return deleted user
    return deletedUser;
  } catch (e) {
    logger.error(`Error deleting user ${id}:`, e);
    throw e;
  }
};
