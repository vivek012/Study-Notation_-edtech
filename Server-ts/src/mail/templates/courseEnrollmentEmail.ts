const courseEnrollmentEmail = (name:string, courseName:string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Course Enrollment Confirmation</title>

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
    }
    .highlight {
      font-weight: bold;
      color: #4f46e5;
    }
    .cta {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 18px;
      background: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
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
      Course Registration Confirmation
    </div>

    <div class="body">
      <p>Dear <b>${name}</b>,</p>

      <p>
        You have successfully registered for the course
        <span class="highlight">${courseName}</span>.
      </p>

      <p>
        We’re excited to have you on <b>StudyHub</b> 🎉  
        Please log in to your learning dashboard to access course materials and start learning.
      </p>

      <a
        href="https://studyhub.vercel.app/dashboard"
        class="cta"
      >
        Go to Dashboard
      </a>
    </div>

    <div class="support">
      If you have any questions or need assistance, feel free to reach out at
      <a href="mailto:support@studyhub.com">support@studyhub.com</a>
    </div>
  </div>
</body>
</html>
`;
};

export default courseEnrollmentEmail;
