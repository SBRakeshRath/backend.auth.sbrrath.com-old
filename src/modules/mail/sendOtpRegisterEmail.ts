import Email from "email-templates";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import composeEmail from "./composeMail.js";

export default async function sendOtpRegisterEmail(to: string,otp:string) {
  try {
    //create mail content
    const email = new Email();
    const html = await email.render(
      path.join(
        dirname(fileURLToPath(import.meta.url)),
        "./mailTemplates/sendOtpToVerifyEmail.pug"
      ),
      {
        OTP: otp,
      }
    );

    const info = composeEmail(to,"OTP to register email",html)
    return info ;
  } catch (error) {
    return error;
  }
}
