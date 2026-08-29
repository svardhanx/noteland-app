import argon2 from "argon2";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import {
  createUser as createUserRepository,
  getUserForLogin,
  setUserLoggedIn,
} from "../repositories/authRepository.js";

export const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required.");
  }

  const hashedPassword = await argon2.hash(password);

  const user = await createUserRepository({
    name,
    email,
    password: hashedPassword,
  });

  if (!user) {
    throw new ApiError(500, "Unable to create the user. Please try again.");
  }

  return user;
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email address and password are required.");
  }

  const user = await getUserForLogin(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordCorrect = await argon2.verify(user.password, password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = jwt.sign(
    {
      id: user.id,
      emailAddress: user.email,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRY,
    },
  );

  await setUserLoggedIn(user.id, true);

  const { password: _password, ...safeUser } = user;

  return {
    token,
    user: {
      ...safeUser,
      isLoggedIn: true,
    },
  };
};

export const logout = async (userId) => {
  if (!userId) {
    throw new ApiError(401, "You're not authorized to perform this action.");
  }

  await setUserLoggedIn(userId, false);
};
