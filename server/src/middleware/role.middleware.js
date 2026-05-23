const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase();

    if (!userRole) {
      return res.status(403).json({
        status: false,
        message: "Role missing.",
      });
    }

    const normalizedRoles = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        status: false,
        message: "Access denied.",
      });
    }

    next();
  };
};

module.exports = roleCheck;