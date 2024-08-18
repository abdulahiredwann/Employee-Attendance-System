const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { auth, admin } = require("../Middleware/Admin");
const authMiddleware = require("../Middleware/Employee");

const prisma = new PrismaClient();
// Create Attendance record
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { employeeId } = req.body;

    const employer = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });
    if (!employer) {
      return res.status(404).send("Employer Not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    // Check existing Recored
    const existingRecord = await prisma.attendance.findFirst({
      where: {
        employeeId: parseInt(employeeId),
        timestamp: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingRecord) {
      return res
        .status(400)
        .send("Attendance record already exists for today.");
    }

    const employeeI = parseInt(employeeId);
    // Check Status of time
    const now = new Date();
    const checkInTime = now.getHours() * 60 + now.getMinutes();
    const cutoffTime = 9 * 60;
    const status = checkInTime > cutoffTime ? "LATE" : "PRESENT";
    const attendance = await prisma.attendance.create({
      data: {
        employeeId: employeeI,
        status,
      },
    });

    res.status(201).send(attendance);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// Get attendance
router.get("/get/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        employeeId: parseInt(employeeId),
        timestamp: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
    });
    res.status(200).send(attendanceRecords);
  } catch (error) {
    console.error("Error retrieving attendance records:", error);
    res.status(500).send("Server Error");
  }
});

// Get all Employee Attendance
router.get("/all", async (req, res) => {
  try {
    const all = await prisma.attendance.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        employeeId: true,
        status: true,
        timestamp: true,
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    res.status(200).send(all);
  } catch (error) {
    res.status(500).send("Server Error");
    console.log(error);
  }
});

// Get Monthly Report
router.get("/monthly", async (req, res) => {
  try {
    const { month } = req.query;
    const date = new Date(month);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const report = await prisma.attendance.findMany({
      where: {
        timestamp: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });

    res.status(200).send(report);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
