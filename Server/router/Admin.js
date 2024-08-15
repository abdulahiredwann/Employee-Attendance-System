const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const prisma = new PrismaClient();
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

function validateAdmin(admin) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return schema.validate(admin);
}

module.exports = router;
