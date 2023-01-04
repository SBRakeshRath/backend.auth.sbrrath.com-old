import { Router } from "express";
import sendOtpRegisterEmail from "../../modules/mail/sendOtpRegisterEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import serverSuccessMessage from "./../../interfaces/serverResponseInterface.js";


const step1Router = Router();

step1Router.get("/step1", async (req, res, next) => {
  //validate email

  const emailInput = req.body.email

  const email = z.string().email().trim().min(3)

  //check if email already exist in db

  //create otp

  const otp = ((length = 6) => {
    let val = "";
    for (let i = 0; i < length; i++) {
      val += Math.floor(Math.random() * 10);
    }
    return val;
  })();

  try {
    //send otp email
    const info = await sendOtpRegisterEmail("sbrakeshrath@gmail.com", otp);

    //encrypt otp
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    //create jwt token
    const jwtData = {
      token: hashedOtp,
    };

    const jwtToken = jwt.sign(jwtData, process.env.jwtTokenSign, {
      expiresIn: 5 * 60,
    });

    res.json(new serverSuccessMessage({ token: jwtToken }).getResponse());
  } catch (error) {
    res.json({
      error: error,
    });
  }
});

export default step1Router;
