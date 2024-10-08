const express = require("express");
const { validateEmployee, validateLogin } = require("../Model/Employe");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth, admin } = require("../Middleware/Admin");
const authMiddleware = require("../Middleware/Employee");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { sendEmail } = require("./SendEmail");

const qrcodeDir = path.join(__dirname, "../qrcode");
if (!fs.existsSync(qrcodeDir)) {
  fs.mkdirSync(qrcodeDir);
}

const prisma = new PrismaClient();

// Register Employee for admin
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const { error } = validateEmployee(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const checkEmail = await prisma.employee.findUnique({
      where: {
        email,
      },
    });
    if (checkEmail) {
      return res.status(400).send("Email Alredy registerd!");
    }
    const randomPassword = crypto.randomBytes(4).toString("hex");

    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    // Save the file path to the database
    const newEmployee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        qrCode: `/qrcode/${email}.png`,
      },
    });

    // Generate QR code data
    const qrCodeData = `Employee:${email}-${firstName}-${lastName}-${Date.now()}-${
      newEmployee.id
    }`;

    // Define file path
    const qrCodeFilePath = path.join(qrcodeDir, `${email}.png`);

    // Generate QR code image and save it
    await QRCode.toFile(qrCodeFilePath, qrCodeData, {
      width: 300,
      margin: 2,
    });
    sendEmail(
      newEmployee.email,
      newEmployee.firstName + " " + newEmployee.lastName,
      randomPassword
    );
    res.status(201).send(_.omit(newEmployee, ["password"]));
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// Get QR code for there employee
router.get("/qrcode/:employeeId", authMiddleware, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!employee || !employee.qrCode) {
      return res.status(404).send("QR code not found");
    }

    // Construct the file path
    const qrCodePath = path.join(
      __dirname,
      "../qrcode",
      `${employee.email}.png`
    );

    // Serve the image file
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${employee.email}.png"`
    );
    res.sendFile(qrCodePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Get emplye info
router.get("/info/:id", async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  try {
    const info = await prisma.employee.findUnique({
      where: { id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });
    if (!info) {
      return res.status(400).send("Employee Not found");
    }
    res.status(200).send(info);
  } catch (error) {
    res.status(500).send("Server Error");
    console.log(error);
  }
});

// Login Employee
router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  const { email, password } = req.body;

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const employe = await prisma.employee.findUnique({ where: { email } });
  if (!employe) {
    return res.status(400).send("email or password is not valid");
  }
  const validatePassword = await bcrypt.compare(password, employe.password);
  if (!validatePassword) {
    return res.status(400).send("email or password is not valid");
  }
  const token = jwt.sign(
    { id: employe.id, email: employe.email },
    process.env.JWT_SECRET
  );
  res.status(200).send({ token, id: employe.id });
});

module.exports = router;
