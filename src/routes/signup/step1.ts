import { Router } from "express";
import sendOtpRegisterEmail from "../../modules/mail/sendOtpRegisterEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import serverSuccessMessage from "./../../interfaces/serverResponseInterface.js";
import serverError from "./../../interfaces/serverErrorInterface.js";
import searchEmail from "../../db/search/searchEmail.js";

const step1Router = Router();


step1Router.post("/step1", async (req, res, next) => {
  //validate email
  const emailFormat = z.string().email().trim().min(3);

  if (!req.body.email) {
    return next(
      new serverError(
        new Error("email not present"),
        403,
        "INVALID_EMAIL",
        "email not present"
      )
    );
  }

  const emailParseResult = emailFormat.safeParse(req.body.email);

  if (emailParseResult.success === false)
    return next(
      new serverError(
        new Error("email not valid"),
        403,
        "INVALID_EMAIL",
        "email not valid"
      )
    );

  const email = emailParseResult.data;

  //check if email already exist in db

  if (!await searchEmail(email, next)) {
    return next(
      new serverError(
        new Error("email exist"),
        403,
        "EMAIL_EXISTS",
        "email is already registered"
      )
    );
  }

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
    const info = await sendOtpRegisterEmail(email, otp);

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
