import jwt from "jsonwebtoken"; // Ensure you have this import
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1]; // Access token from Authorization header
  const refreshToken = Array.isArray(req.headers["refresh-token"])
    ? req.headers["refresh-token"][0]
    : req.headers["refresh-token"]; // Ensure refresh token is a string

  if (!accessToken || !refreshToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No tokens provided" });
  }

  try {
    // Verify access token
    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res.status(500).json({
        message: "Internal Server Error: Missing access token secret",
      });
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach user information to the request
    return next(); // Proceed if access token is valid
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      try {
        // Verify the refresh token
        if (!process.env.REFRESH_TOKEN_SECRET) {
          return res.status(500).json({
            message: "Internal Server Error: Missing refresh token secret",
          });
        }
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        // Generate new access token
        if (typeof decodedRefresh !== "string" && "user" in decodedRefresh) {
          const newAccessToken = generateAccessToken(decodedRefresh.user); // Assuming user ID is in the payload

          // Set both tokens as cookies
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            sameSite: "strict",
          });

          res.cookie("refreshToken", refreshToken, {
            // Send back the refresh token as well
            httpOnly: true,
            sameSite: "strict",
          });

          // Optionally, you can return a response or proceed to the next middleware
          return res
            .status(200)
            .json({ accessToken: newAccessToken, refreshToken });
        } // <-- Add this closing brace
      } catch (refreshErr) {
        console.error(refreshErr);
        return res
          .status(401)
          .json({ message: "Unauthorized: Invalid refresh token" });
      }
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  }
};

function generateAccessToken(userId) {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Missing access token secret");
  }
  return jwt.sign({ user: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  });
}

export default verifyToken;
