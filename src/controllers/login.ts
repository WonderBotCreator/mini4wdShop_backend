import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import express, { NextFunction } from 'express';
import z from "zod";

const prisma = new PrismaClient()
    .$extends(withAccelerate());

const loginRouter = express.Router()


loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.customer.findUnique({
        where: {
            email: email,
        },
    })


    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        res.status(400).send({error: [{message: "email or password is invalid"}], status: "error" })
        return
    }

    const userForToken = {
        username: user?.username,
        id: user?.id
    }

    const token = jwt.sign(userForToken, process.env.SECRET as string, {expiresIn: 60*60})

    res.status(200).send({token, username: user?.username, status: "success"})
})

export default loginRouter;