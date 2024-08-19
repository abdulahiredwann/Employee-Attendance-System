require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const employee = require("./router/Employee");
const attendance = require("./router/Attendance");
const admin = require("./router/Admin");
app.use(cors());
app.use(express.json());
const path = require("path"); // Import the path module
app.use("/qrcode", express.static(path.join(__dirname, "qrcode")));
app.use(express.static("public"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "EAS",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to Database: " + err.stack);
    return;
  }
  console.log("Connected to DB ");
});

app.use("/api/employee", employee);
app.use("/api/attendance", attendance);
app.use("/api/admin", admin);

app.listen(3000, () => {
  console.log("Servier Listening 3000");
});

// require("./scheduled");
