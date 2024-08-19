const nodemailer = require("nodemailer");

async function sendPasswordByEmail(recipientEmail, name, randomPassword) {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Correct service key
      auth: {
        user: process.env.User, // Ensure these environment variables are set correctly
        pass: process.env.Pass,
      },
    });

    // Set up email data with HTML content
    const mailOptions = {
      from: '"ABD tech" <' + process.env.User + ">", // Sender address
      to: recipientEmail, // Recipient address
      subject: "Your New Account Password", // Subject line
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .banner {
    background-image: url('https://i.ibb.co/qWqQx0P/ABD.jpg');
    background-size: cover; /* Ensures the image covers the entire area */
    background-position: center; /* Centers the image */
    background-repeat: no-repeat; /* Prevents repeating the image */
    color: #ffffff;
    padding: 10px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    width: 100%; /* Makes the banner span the full width of the container */
    height: 150px; /* Sets a fixed height for the banner */
  }
            .content {
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
            }
            .password {
              display: inline-block;
              padding: 10px;
              background-color: #e9ecef;
              border: 1px solid #ced4da;
              border-radius: 5px;
              font-family: monospace;
            }
            .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #6c757d;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="banner">
              Welcome to ABD Tech
            </div>
            <div class="content">
              <p>Hello, ${name}</p>
              <p>Your account has been created. Your password is:</p>
              <p><span class="password">${randomPassword}</span></p>
              <p>Please log in and change your password as soon as possible.</p>
              <p class="footer">
                Best regards,<br>
                Your Company
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports.sendEmail = sendPasswordByEmail;
