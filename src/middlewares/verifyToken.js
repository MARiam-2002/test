import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "fail",
          message: "Token expired",
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          status: "fail",
          message: "Invalid token",
        });
      }

      return res.status(500).json({
        status: "error",
        message: "Server error during token verification",
      });
    }
  } else {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized access: No token provided",
    });
  }
}

export function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.id) {
      res.status(403).json({ message: "you are  not Authorized" });
    } else {
      next();
    }
  });
}
export function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden: You are not authorized as admin",
      });
    }
  });
}

export function verifyAdminAndAuthorized(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && (req.user.isAdmin || req.user.id === req.params.id)) {
      next();
    } else {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden: You are not authorized as this user or  admin",
      });
    }
  });
}
