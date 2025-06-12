import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import express, { NextFunction } from 'express';
import { Request,Response } from 'express';
import { NewUser, User, userSchema } from "../../types";
import z from "zod";

const prisma = new PrismaClient()
    .$extends(withAccelerate());

const registerRouter = express.Router()


const newUserParser = (req: Request, _res: Response, next: NextFunction)=>{
    try{
        userSchema.parse(req.body);
        console.log(req.body);
        next();
    }catch(error: unknown){
        next(error);
    }
};

const errorMiddleware = (error: unknown, _req:Request, res: Response, next: NextFunction)=>{
    if(error instanceof z.ZodError){
        res.status(400).send({error: error.issues});
    }else{
        next(error);
    }
}

registerRouter.post(
    '/',
    newUserParser
    ,
    async(req: Request<unknown, unknown, NewUser>, res: Response<Object>)=>{
        const { username, email, password } = req.body;

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    console.log(username);

    const user1 = await prisma.user.create({
    data: {
      email: email,
      username: username,
      passwordHash: passwordHash
    },
    include: {
      books: false,
    },
  });

    res.json({message: "register successfully"});
    }
)

registerRouter.use(errorMiddleware)

export default registerRouter;