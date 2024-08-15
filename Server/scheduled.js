const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updateAttendance = async () => {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of the next day

    // Find all employees
    const employees = await prisma.employee.findMany();

    // Loop through employees and check for missing attendance records
    for (const employee of employees) {
      const attendanceRecord = await prisma.attendance.findFirst({
        where: {
          employeeId: employee.id,
          timestamp: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      // If no attendance record found, create an absent record
      if (!attendanceRecord) {
        await prisma.attendance.create({
          data: {
            employeeId: employee.id,
            status: "ABSENT",
            timestamp: new Date(), // Use current time for record
          },
        });
      }
    }

    console.log("Attendance status updated for the day.");
  } catch (error) {
    console.error("Error updating attendance status:", error);
  }
};

// Schedule the task to run every day at 6:00 PM
cron.schedule("0 18 * * *", updateAttendance);
