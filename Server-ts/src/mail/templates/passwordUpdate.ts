const passwordUpdateTemplate = (
  name:any,
  email:any,
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Updated</title>

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
      background: #dc2626;
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
      color: #dc2626;
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
    <a href="https://studyHub-edtech-project.vercel.app">
      <img
        class="logo"
        src="https://i.ibb.co/7XyJ3PC/logo.png"
        alt="StudyHub Logo"
      />
    </a>

    <div class="message">
      Password Updated Successfully
    </div>

    <div class="body">
      <p>Hey <b>${name}</b>,</p>

      <p>
        Your password has been successfully updated for the email
        <span class="highlight">${email}</span>.
      </p>

      <p>
        If you did not request this password change, please contact our support team immediately to secure your account.
      </p>
    </div>

    <div class="support">
      Need help? Contact us at
      <a href="mailto:info@studynotion.com">info@studynotion.com</a>
    </div>
  </div>
</body>
</html>
`;
};

export default passwordUpdateTemplate;
