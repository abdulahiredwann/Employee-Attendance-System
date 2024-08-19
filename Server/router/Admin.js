const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { auth, admin } = require("../Middleware/Admin");

const prisma = new PrismaClient();
// Create Admin
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { error } = validateAdmin(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const checkEmail = await prisma.admin.findUnique({
      where: { email },
    });
    if (checkEmail) {
      return res.status(400).send("Email Alredy registred!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });
    res.status(201).send(_.omit(admin, ["password"]));
  } catch (error) {}
});

// Login admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return res.status(400).send("Email or Password is not Valid!");
  }

  const validatePassword = await bcrypt.compare(password, admin.password);
  if (!validatePassword) {
    return res.status(400).send("Email or Password is not Valid!");
  }
  const token = jwt.sign(
    { id: admin.id, email: admin.email, isAdmin: true },
    process.env.JWT_SECRET
  );
  res.status(200).send({ token });
});

// Get Admin Info
router.get("/user", auth, async (req, res) => {
  try {
    const { id } = req.user;
    let user = await prisma.admin.findUnique({ where: { id } });
    if (!user) {
      return res.status(400).send("User not found");
    }
    res.status(200).send(_.omit(user, ["password"]));
  } catch (error) {
    res.status(500).send("Server Error");
    console.log(error);
  }
});

// Middleware
router.get("/validate", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).send("Token Required!");
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode.isAdmin) {
      return res.status(403).send("Access denied .Invalid token!");
    }
    res.status(200).send({ validateAdmin: true });
  } catch (error) {
    console.log("Error verfiy Admin token", error);
    res.status(500).send("Server Error");
  }
});
function validateAdmin(admin) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return schema.validate(admin);
}
function validateLogin(admin) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return schema.validate(admin);
}

module.exports = router;
