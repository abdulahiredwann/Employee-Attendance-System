# Employee Attendance System

A comprehensive web-based employee attendance system that leverages QR code technology for efficient tracking. This system automates the monitoring of attendance, marks employees as late if they check in after 9:00 AM, and sends warnings for excessive absences or lateness.

## Key Features

- **QR Code Check-In**: Employees check in by scanning a QR code.
- **Automatic Absence Scanning**: The system scans for absent employees daily at 12:00 PM.
- **Warning System**: Automatically warns employees with 4 absences or 4 late check-ins.
- **Late Check-In Detection**: Employees who check in after 9:00 AM are marked as late.
- **Comprehensive Reporting**: Generates reports based on attendance data.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT)
- **QR Code Generation**: `qrcode` npm package

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/employee-attendance-system.git
   cd employee-attendance-system
2. Install dependencies for both client and server
```bash
npm install
cd client
npm install
cd ..
```
3. Set up the environment variables:
   ```
     PORT=4000
    DATABASE_URL=your_mysql_database_url
    JWT_SECRET=your_jwt_secret
   ```

4.Run the application:
  ```
npm run dev
```

Usage
Employee Check-In: Employees scan their QR codes to check in.
Attendance Monitoring: The system automatically scans for absentees at 12:00 PM daily.
Warning System: The system sends warnings to employees who have 4 absences or are late 4 times.
