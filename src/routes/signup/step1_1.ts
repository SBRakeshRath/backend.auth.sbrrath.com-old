import { Router } from "express";
import serverError from "./../../interfaces/serverErrorInterface.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { z } from "zod";
import serverSuccessMessage from "../../interfaces/serverResponseInterface.js";


const step1_1Router = Router();

step1_1Router.post("/step1Otp", async (req, res, next) => {

  if (!req.body.emailToken) {
    return next(
      new serverError(
        new Error("token not present"),
        403,
        "INVALID_DATA",
        "token not present"
      )
    );
  }

  if (!req.body.otp) {
    if (!req.body.emailToken) {
      return next(
        new serverError(
          new Error("otp not present"),
          403,
          "INVALID_DATA",
          "otp not present"
        )
      );
    }
  }

  //valid otp

  const otpFormat = z.string().trim().length(6);

  const otpParseResult = otpFormat.safeParse(req.body.otp);

  if (otpParseResult.success === false) {
    return next(
      new serverError(
        new Error("OTP not valid"),
        403,
        "INVALID_DATA",
        "OTP not valid"
      )
    );
  }

  const tokenFormat = z.string().trim();
  const tokenFormatParseResult = tokenFormat.safeParse(req.body.emailToken);
  if (tokenFormatParseResult.success === false) {
    return next(
      new serverError(
        new Error("TOKEN not valid"),
        403,
        "INVALID_TOKEN",
        "TOKEN not valid"
      )
    );
  }

  const token = tokenFormatParseResult.data;
  const otp = otpParseResult.data;

  //decrypt jwt token

  try {
    const tokenData = jwt.verify(
      token,
      process.env.jwtTokenSign
    ) as jwt.JwtPayload;


    if (!(tokenData.name === "step1")) {
      throw { name: "JsonWebTokenError" };
    }

    const passHash = tokenData.token.trim();
    const email = tokenData.email.trim();

    //decrypt the otp hash

    const otpMatch = await bcrypt.compare(otp, passHash);

    if (!otpMatch) throw { name: "otpInvalid" };

    const resTokenData = {
      email: email,
      name: "step1Otp",
    };

    const jwtToken = jwt.sign(resTokenData, process.env.jwtTokenSign);
  

    res.json(new serverSuccessMessage({ token: jwtToken }).getResponse());
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
      case "JsonWebTokenError":
      case "NotBeforeError":
        return next(
          new serverError(
            new Error("TOKEN not valid"),
            403,
            "INVALID_TOKEN",
            error.name
          )
        );

      case "otpInvalid":
        return next(
          new serverError(
            new Error("OTP not valid"),
            403,
            "INVALID_DATA",
            "OTP not valid"
          )
        );

      default:
        return next(
          new serverError(
            new Error("internal error"),
            403,
            "INTERNAL_ERROR",
            "internal error"
          )
        );
        break;
    }
  }
});

export default step1_1Router;
