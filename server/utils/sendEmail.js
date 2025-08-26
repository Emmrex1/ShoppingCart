import nodemailer from "nodemailer";


const sendEmail = async ({ to, subject, html, text }) => {
  if (!to?.trim()) {
    console.error("❌ No recipient email provided.");
    return { success: false, message: "Recipient email is required." };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    

    const mailOptions = {
      from: `" Emmrex ShoppingCart" <${process.env.EMAIL_USER}>`,
      to,
      subject: subject || "Notification from Emmrex ShoppingCart",
      text: text || "You have a new notification from Emmrex ShoppingCart.",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    //  console.log(`✅ Email sent to ${to} — ID: ${info.messageId}`);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    return { success: false, message: error.message };
  }
};

export default sendEmail;
