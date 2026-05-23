const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    let token =
      req.headers["authorization"] || req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authorization token required.",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "YOUR_SECRET_KEY"
    );

    req.user = decoded; // attach user

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message:
        error.name === "TokenExpiredError"
          ? "Token has expired."
          : "Unauthorized access.",
    });
  }
};

module.exports = authMiddleware;