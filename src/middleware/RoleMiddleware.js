const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. User does not have a role.",
        });
    }

    if (!allowedRoles.includes(user.role)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You do not have permission to access this resource.",
        });
    }

    next();
  };
};

module.exports = roleMiddleware;
