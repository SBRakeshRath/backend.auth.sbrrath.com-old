import nodemailer from "nodemailer";

import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";

const composeEmail = async (to:string,subject:string,body:string) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.otpSenderEmail,
      pass: process.env.otpSenderEmailPassword,
    },
  });




  try {




    //mail options 

    const mailOptions = {
      from: process.env.otpSenderEmail,
      to: to,
      subject: subject,
      html:body
    };
    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    return error;
  }
};

export default composeEmail;
