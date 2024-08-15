const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
// Create Attendance record
router.post("/", async (req, res) => {
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
router.get("/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendanceRecords = await prisma.attendance.findMany({
      where: { employeeId: parseInt(employeeId) },
    });
    res.status(200).send(attendanceRecords);
  } catch (error) {
    console.error("Error retrieving attendance records:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
