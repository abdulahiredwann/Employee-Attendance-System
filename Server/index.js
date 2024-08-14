const express = require("express");
const app = express();
const mysql = require("mysql2");

const cors = require("cors");
app.use(cors());
app.use(express.json());

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

app.listen(3000, () => {
  console.log("Servier Listening 3000");
});
