import db from "../db/db.js";
import { users } from "../db/schema/schema.js";
import { eq } from "drizzle-orm";
import dbOperation from "../utils/dbOperation.js";

export const createUser = async ({ name, email, password }) => {
  const result = await dbOperation(() =>
    db
      .insert(users)
      .values({
        name,
        email,
        password,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        isLoggedIn: users.isLoggedIn,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      }),
  );

  return result[0];
};

export const getUserForLogin = async (email) => {
  const result = await dbOperation(() =>
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        password: users.password,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1),
  );

  return result[0];
};

export const setUserLoggedIn = async (userId, isLoggedIn) => {
  const result = await dbOperation(() =>
    db
      .update(users)
      .set({
        isLoggedIn,
      })
      .where(eq(users.id, Number(userId)))
      .returning({
        id: users.id,
      }),
  );

  return result[0];
};

export const getUserById = async (userId) => {
  const result = await dbOperation(() =>
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        isLoggedIn: users.isLoggedIn,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1),
  );

  return result[0];
};
