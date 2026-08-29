import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  register as registerService,
  login as loginService,
  logout as logoutService,
} from "../services/authService.js";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
};

export const registerController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerService({
    name,
    email,
    password,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        user,
        "Registration successful. Please login to continue.",
      ),
    );
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { token, user } = await loginService({
    email,
    password,
  });

  return res
    .status(200)
    .cookie("noteland_token", token, options)
    .json(new ApiResponse(200, user, "Login successful."));
});

export const logoutController = asyncHandler(async (req, res) => {
  await logoutService(req.user.id);

  return res
    .status(200)
    .clearCookie("noteland_token", options)
    .json(new ApiResponse(200, null, "Logout successful."));
});

export const meController = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        isLoggedIn: Boolean(req.user.isLoggedIn),
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
      "Authenticated user fetched successfully.",
    ),
  );
});
