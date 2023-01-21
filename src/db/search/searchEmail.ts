import clientData from "../dbConnect.js";
import { z } from "zod";
import { NextFunction } from "express";
import serverError from "./../../interfaces/serverErrorInterface.js";
import pg from 'pg';
const {Client} = pg ;


const queryText = "SELECT  email FROM auth.auth WHERE $1 = any (email) ;";

const emailFormat = z.string().email().trim().min(3);



export default async function searchEmail(email: string, next: NextFunction) {

  const emailParseResult = emailFormat.safeParse(email);

  if (emailParseResult.success === false)
    return next(
      new serverError(
        new Error("email not valid"),
        403,
        "INVALID_EMAIL",
        "email not valid"
      )
    );

  const trimmedEmail = emailParseResult.data;
  const queryValues = [email];

  //database operation

  try {
    const client = new Client(clientData)
    await client.connect();
    const data = await client.query(queryText, queryValues);
    await client.end();
    return Number(data.rowCount) === 0;
  } catch (error) {
    return next (new serverError(new Error("internal error "),500,"INTERNAL_ERROR","internal error"))
  
  }
}
