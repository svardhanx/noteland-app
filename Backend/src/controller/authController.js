import argon2 from "argon2";
import db from "../DB/db.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // sameSite: None requires secure to be true
};

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
        success: false,
      });
    }

    const hashedPassword = await argon2.hash(password);

    const result = await db.execute({
      sql: "INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING *",
      args: [name, email, hashedPassword],
    });

    return res.status(201).json({
      message: "Registration Successful. Please login to continue.",
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    return res.status(404).json({
      message: "Registration Failed. Please try again.",
      success: false,
    });
  }
};

export const loginController = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email address and password are required.",
        success: false,
      });
    }

    const existingUser = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });

    if (existingUser.rows?.length === 0) {
      return res
        .status(401)
        .json({ message: "No such user found", success: false });
    }

    const user = existingUser.rows[0];

    if (user.email !== email) {
      return res.status(401).json({
        message: "Invalid email. No such user found.",
        success: false,
      });
    }

    const { id, name, email: emailAddress, created_at, updated_at } = user;

    const userPasswordInDB = user.password;

    const isPasswordCorrect = await argon2.verify(userPasswordInDB, password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message:
          "Password incorrect. Please check your password and try again.",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        id,
        emailAddress,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRY,
      },
    );

    if (!token) {
      console.error("Error generating token");
      return res.status(500).json({
        message: "Error while logging in. Please try again",
        success: false,
      });
    }

    if (token) {
      await db.execute({
        sql: "UPDATE users SET is_logged_in = 1 WHERE id = ?",
        args: [user.id],
      });

      return res
        .status(200)
        .cookie("noteland_token", token, options)
        .json({
          message: "Login Successful",
          success: true,
          user: {
            id,
            name,
            email: emailAddress,
            is_logged_in: true,
            created_at,
            updated_at,
          },
        });
    }
  } catch (error) {
    console.error("Error in loginController:", error);
    return res.status(404).json({
      message:
        "Error validating your credentials. Please re-check your credentials.",
      success: false,
    });
  }
};

export const logoutController = async function (req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to perform this action.",
        success: false,
      });
    }

    await db.execute({
      sql: "UPDATE users SET is_logged_in = 0 WHERE id = ?", // SQLite uses 0 for false
      args: [userId],
    });

    return res
      .status(200)
      .clearCookie("noteland_token", options)
      .json({ message: "Logout successful", success: true });
  } catch (error) {
    console.error("Error in logoutController controller: ", error);
    return res.status(400).json({
      message: "Error occurred while logging out. Please try again",
      success: false,
    });
  }
};

export const userController = async function (req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(404).json({ message: "No user found", success: false });
    }

    const result = await db.execute({
      sql: "SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?",
      args: [userId],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No such user found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error in userController controller:", error);
    return res.status(500).json({
      message: "Error occurred while fetching user information.",
      success: false,
    });
  }
};

export const meController = async function (req, res) {
  try {
    const incomingToken =
      req.cookies.noteland_token ||
      req.body.noteland_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingToken) {
      return res
        .status(200)
        .json({ message: "User not logged in.", isLoggedIn: false });
    } else {
      return res
        .status(200)
        .json({ message: "User logged in.", isLoggedIn: true });
    }
  } catch (error) {
    console.error("Something went wrong in the meController", error);
  }
};
