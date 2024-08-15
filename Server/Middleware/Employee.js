const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Access denied. No token provided");
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.employeeId = decode.id;

    const { employeeId } = req.params;
    if (parseInt(employeeId) !== req.employeeId) {
      return res.status(403).send("Unauthorized access");
    }

    next();
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
};
module.exports = authMiddleware;
