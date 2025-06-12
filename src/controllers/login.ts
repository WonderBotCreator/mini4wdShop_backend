import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import express, { NextFunction } from 'express';
import z from "zod";

const prisma = new PrismaClient()
    .$extends(withAccelerate());

const loginRouter = express.Router()

loginRouter.get('/', async(req, res)=>{
    res.json({message: "hello"})
})

// loginRouter.post('/', async (req, res) => {
//     const { email, password } = req.body;
//     console.log("post request")
//     // const user = await prisma.user.findUnique({
//     //     where: { email: email },
//     // });

//     res.json({name: "Lando"});
// })

export default loginRouter;