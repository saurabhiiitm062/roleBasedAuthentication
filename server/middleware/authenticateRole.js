const jwt = require("jsonwebtoken");

module.exports = authenticateRole = (requiredRole) => (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;

    const userRole = req.user.role;

    if (userRole === "admin") {
      // Admin has access to all routes
      next();
    } else if (userRole === "moderator" && requiredRole === "admin") {
      return res
        .status(404)
        .json({ message: "Moderators cannot access admin route" });
    } else if (
      userRole === "moderator" &&
      (requiredRole === "admin" || requiredRole === "moderator")
    ) {
      next();
    } else if (
      userRole === "user" &&
      (requiredRole === "admin" ||
        requiredRole === "moderator" ||
        requiredRole === "user")
    ) {
      return res
        .status(404)
        .json({ message: "Users cannot access admin and moderator routes" });
    } else if (
      userRole === "user" &&
      (requiredRole === "admin" ||
        requiredRole === "moderator" ||
        requiredRole === "user")
    ) {
      return res
        .status(404)
        .json({ message: "Users cannot access admin and moderator routes" });
    } else if (
      userRole === "user" &&
      (requiredRole === "admin" || requiredRole === "moderator")
    ) {
      return res
        .status(404)
        .json({ message: "Users cannot access admin and moderator routes" });
    } else {
      // For other roles or non-matching cases, handle as needed
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
