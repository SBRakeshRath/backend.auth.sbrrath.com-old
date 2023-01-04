import { Router } from "express";
import step1Router from './signup/step1.js';

const signUpRouter = Router()


//routers

signUpRouter.use(step1Router);

signUpRouter.get('/',(req,res,next)=>{


    res.json({page:"signup"})
})

export default signUpRouter;