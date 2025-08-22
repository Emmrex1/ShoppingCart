export const registerSuccessTemplate = (username, verificationLink) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 50px 0; color: #444;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 40px 50px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);">
      
      <div style="text-align: center; margin-bottom: 35px;">
        <img src="https://res.cloudinary.com/dwhx6woy3/image/upload/v1753202544/iu7bg4g8aby5ifs94xow.png" alt="Emmrex ShoppingCart Logo" style="max-width: 150px;"/>
      </div>

      <h1 style="color: #3b82f6; font-weight: 700; font-size: 28px; text-align: center; margin-bottom: 15px;">
        Welcome aboard, ${username}! 🎉
      </h1>

      <p style="font-size: 17px; line-height: 1.65; text-align: center; color: #555; margin-bottom: 30px;">
        Before you can start shopping, please verify your email to activate your account.
      </p>

      <div style="text-align: center; margin-bottom: 35px;">
        <a href="${verificationLink}" 
           style="display: inline-block; background-color: #3b82f6; color: #fff; padding: 14px 32px; font-weight: 600; font-size: 16px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
          Verify My Email
        </a>
      </div>

      <p style="font-size: 14px; text-align: center; color: #777;">
        If you did not create this account, please ignore this email.
      </p>

      <p style="text-align: center; font-size: 12px; color: #bbb; margin-top: 15px;">
        © ${new Date().getFullYear()} Emmrex ShoppingCart. All rights reserved.
      </p>
    </div>
  </div>
`;
