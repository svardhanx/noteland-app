import jwt from "jsonwebtoken";
import { getUserById } from "../repositories/authRepository.js";

const verifyJWT = async (req, res, next) => {
  try {
    const incomingToken =
      req.cookies.noteland_token ||
      req.body?.noteland_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingToken) {
      return res
        .status(401)
        .json({ message: "Incoming token not found", success: false });
    }

    const decodedToken = jwt.verify(incomingToken, process.env.TOKEN_SECRET);

    const user = await getUserById(decodedToken.id);

    if (!user)
      return res.status(401).json({
        message: "Your session is no longer valid. Please log in again.",
        success: false,
      });

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in Auth middleware:", error);

    return res.status(401).json({
      message: "Token Expired or missing",
      type: "TOKEN_FAILURE",
      success: false,
    });
  }
};

export default verifyJWT;
