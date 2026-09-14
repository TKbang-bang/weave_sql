import nodemailer from "nodemailer";
import { customAlphabet } from "nanoid";

const alphabet = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 6);

const emailSender = async (email) => {
  const code = nanoid();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
  });

  const mailOptions = {
    from: `"Weave Security" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your Weave verification code",
    html: ` <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>Weave Email Verification</title> </head> <body style=" margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif; color: #1f2937; "> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 40px 20px;" > <tr> <td align="center"> <table width="100%" cellpadding="0" cellspacing="0" border="0" style=" max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; " > <!-- Header --> <tr> <td align="center" style=" padding: 32px 30px 24px; border-bottom: 1px solid #f0f0f0; " > <div style=" font-size: 28px; font-weight: 700; letter-spacing: -0.5px; color: #111827; "> Weave </div> <div style=" margin-top: 6px; font-size: 13px; color: #6b7280; letter-spacing: 0.5px; "> SECURITY </div> </td> </tr> <!-- Content --> <tr> <td style="padding: 40px 40px 20px;"> <h1 style=" margin: 0 0 16px; text-align: center; font-size: 24px; line-height: 32px; color: #111827; "> Verify your email </h1> <p style=" margin: 0; text-align: center; font-size: 15px; line-height: 24px; color: #6b7280; "> Enter the verification code below to confirm your email address and continue setting up your Weave account. </p> <!-- Verification Code --> <div style=" margin: 32px 0; padding: 24px; text-align: center; background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 10px; "> <div style=" margin-bottom: 10px; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; "> Verification code </div> <div style=" font-size: 32px; line-height: 40px; font-weight: 700; letter-spacing: 7px; color: #111827; "> ${code} </div> </div> <p style=" margin: 0; text-align: center; font-size: 13px; line-height: 20px; color: #9ca3af; "> This code will expire in <strong style="color: #6b7280;">5 minutes</strong>. </p> <p style=" margin: 28px 0 0; font-size: 13px; line-height: 20px; color: #6b7280; "> If you didn't request this verification code, you can safely ignore this email. Your account will remain secure. </p> </td> </tr> <!-- Footer --> <tr> <td style=" padding: 24px 40px 32px; text-align: center; "> <div style=" height: 1px; background-color: #eeeeee; margin-bottom: 24px; "></div> <p style=" margin: 0; font-size: 13px; line-height: 20px; color: #9ca3af; "> This is an automated security email from Weave. </p> <p style=" margin: 8px 0 0; font-size: 13px; color: #9ca3af; "> © ${new Date().getFullYear()} Weave </p> </td> </tr> </table> </td> </tr> </table> </body> </html> `,
  };

  const info = await transporter.sendMail(mailOptions);
  return info.accepted
    ? { ok: true, code }
    : { ok: false, message: "Mail failed to send, try again" };
};

export default emailSender;
