export const EmailLayout = (headerContent: string, bodyContent: string) => `
  <div style="font-family: 'DM Sans', sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
    <!-- Container with max-width for centering -->
    <div style="max-width: 600px; width: 100%; margin: auto; background-color: #ffffff; overflow: hidden;">
      <div style="background-color:rgb(240, 240, 240); padding: 20px; text-align: center;">
        <img src="https://queensford.edu.au/wp-content/uploads/2020/05/cropped-new-logo.png" alt="Queensford Logo" style="height: 150px;" />
      </div>
      <div style="padding: 20px 20px 0 20px;min-height: 300px;color: #414141; font-size: 16px;">
        ${bodyContent}
      </div>
      <div style="background-color: #249B99; padding: 5px 20px; text-align: right;">
      <p style="font-weight: 500; font-size: 14px; color: #ffffff; margin: 0;">
        2024 © Copyright, Queensford edu.au All rights reserved.
      </p>
    </div>
    </div>
  </div>
`;

export const ResendRegistrationOtpEmail = (
  registration_link: string,
  otp: string
) => {
  const bodyContent = `
      <p>Hi Student,</p>
      <br/>
      <p>
       Please use the below OTP code to verify your account.
      </p>
      <p style="color: #249B99; text-decoration: underline;">
        ${otp}
      </p>
      <p>
        We’re excited to see you!
      </p>
      <a href="${registration_link}">
      <p style="display: inline-block; background-color: #249B99; color: #ffffff; text-decoration: none; 
                padding: 5px 20px; border-radius: 5px; font-size: 16px; margin-top: 30px; margin-bottom: 30px;">
         Verify Now
      </p>
      </a>
    `;

  return EmailLayout('', bodyContent);
};
