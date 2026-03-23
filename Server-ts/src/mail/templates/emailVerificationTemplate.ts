const emailVerificationTemplate = (otp:any) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Verification</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .logo {
      max-width: 160px;
      margin: 20px auto;
      display: block;
    }
    .message {
      background: #4f46e5;
      color: #ffffff;
      padding: 16px;
      font-size: 20px;
      text-align: center;
      font-weight: bold;
    }
    .body {
      padding: 24px;
      color: #333333;
      line-height: 1.6;
      text-align: center;
    }
    .highlight {
      font-size: 28px;
      letter-spacing: 4px;
      font-weight: bold;
      color: #4f46e5;
      margin: 20px 0;
    }
    .support {
      padding: 16px;
      background: #f1f5f9;
      font-size: 14px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <a href="https://studyhub.vercel.app">
      <img
        class="logo"
        src="https://i.ibb.co/7XyJ3PC/logo.png"
        alt="StudyHub Logo"
      />
    </a>

    <div class="message">
      OTP Verification Email
    </div>

    <div class="body">
      <p>Dear User,</p>

      <p>
        Thank you for registering with <b>StudyHub</b>.
        To complete your registration, please use the OTP below:
      </p>

      <div class="highlight">${otp}</div>

      <p>
        This OTP is valid for <b>5 minutes</b>.
        Please do not share this OTP with anyone.
      </p>

      <p>
        If you did not request this verification, you can safely ignore this email.
      </p>
    </div>

    <div class="support">
      If you have any questions or need assistance, reach out to us at
      <a href="mailto:support@studyhub.com">support@studyhub.com</a>
    </div>
  </div>
</body>
</html>
`;
};



export default emailVerificationTemplate;
