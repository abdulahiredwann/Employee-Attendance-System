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

const qrcodeDir = path.join(__dirname, "../qrcode");
if (!fs.existsSync(qrcodeDir)) {
  fs.mkdirSync(qrcodeDir);
}

const prisma = new PrismaClient();

// Register Employee
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
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
      return res.status(400).send("email Alredy registerd!");
    }

    // Generate QR code data
    const qrCodeData = `Employee:${email}-${firstName}-${lastName}-${Date.now()}`;

    // Define file path
    const qrCodeFilePath = path.join(qrcodeDir, `${email}.png`);

    // Generate QR code image and save it
    await QRCode.toFile(qrCodeFilePath, qrCodeData, {
      width: 300,
      margin: 2,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
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
    res.status(201).send(_.omit(newEmployee, ["password"]));
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// Get QR code
router.get("/qrcode/:employeeId", async (req, res) => {
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

// Login Employee
router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  const { email, password } = req.body;

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const employe = await prisma.employee.findUnique({ where: { email } });
  if (!employe) {
    return res.status(404).send("email or password is not valid");
  }
  const validatePassword = await bcrypt.compare(password, employe.password);
  if (!validatePassword) {
    return res.status(404).send("email or password is not valid");
  }
  const token = jwt.sign(
    { id: employe.id, email: employe.email },
    process.env.JWT_SECRET
  );
  res.status(200).json({ token });
});

module.exports = router;
