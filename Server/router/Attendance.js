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
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });
    if (!employee) {
      return res.status(400).send("Employee Not Found!");
    }
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

// Get Today Report
router.get("/today", async (req, res) => {
  const date = new Date();
  const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Midnight of today
  const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of today

  try {
    const todayReport = await prisma.attendance.findMany({
      where: {
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    res.status(200).send(todayReport);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Get Yesterday report
router.get("/yesterday", async (req, res) => {
  const date = new Date();

  // Calculate the start and end of yesterday
  const startOfDay = new Date(date.setDate(date.getDate() - 1));
  startOfDay.setHours(0, 0, 0, 0); // Midnight of yesterday

  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  try {
    const todayReport = await prisma.attendance.findMany({
      where: {
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    res.status(200).send(todayReport);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Get Warning Person
router.get("/warning", [auth, admin], async (req, res) => {
  try {
    // Fetch all attendance records
    const attendanceRecords = await prisma.attendance.findMany();

    // Organize attendance records by employeeId
    const employeeAttendance = {};

    attendanceRecords.forEach((record) => {
      const { employeeId, status } = record;
      if (!employeeAttendance[employeeId]) {
        employeeAttendance[employeeId] = { late: 0, absent: 0 };
      }
      if (status === "LATE") {
        employeeAttendance[employeeId].late += 1;
      } else if (status === "ABSENT") {
        employeeAttendance[employeeId].absent += 1;
      }
    });

    // Filter employees with warnings and retrieve their information
    const warningEmployees = await Promise.all(
      Object.keys(employeeAttendance)
        .filter((employeeId) => {
          const { late, absent } = employeeAttendance[employeeId];
          return late >= 3 || absent >= 5;
        })
        .map(async (employeeId) => {
          // Fetch employee details
          const employee = await prisma.employee.findUnique({
            where: { id: parseInt(employeeId) },
            select: { firstName: true, lastName: true, email: true },
          });

          return {
            employeeId,
            firstName: employee?.firstName,
            lastName: employee?.lastName,
            email: employee?.email,
            ...employeeAttendance[employeeId],
          };
        })
    );

    // Send response with warning employees
    res.status(200).json(warningEmployees);
  } catch (error) {
    res.status(500).send("Server error");
    console.error("Error retrieving warning persons:", error);
  }
});

module.exports = router;
