import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { NewUser, User, userSchema } from "../../types";
import z from "zod";

const prisma = new PrismaClient()
    .$extends(withAccelerate());

const registerRouter = express.Router()


const newUserParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        userSchema.parse(req.body);
        //console.log(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof z.ZodError) {
        res.status(400).send({ error: error.issues });
    } else {
        next(error);
    }
}

registerRouter.post(
    '/',
    newUserParser
    ,
    async (req: Request<unknown, unknown, NewUser>, res: Response<Object>) => {
        try {
            const { username, email, password } = req.body;

            const alreadyUsername = await prisma.customer.findUnique({
                where: {
                    username: username
                }
            })



            if (alreadyUsername) {
                res.status(400).send({error: [{message: "This username is already used"}], status: "error" })
                return
            }

            const alreadyEmail = await prisma.customer.findUnique({
                where: {
                    email: email
                }
            })

            if (alreadyEmail) {
                res.status(400).send({error: [{message: "This email is already used"}], status: "error" })
                return
            }

            const saltRounds = 10
            const passwordHash = await bcrypt.hash(password, saltRounds)

            //console.log(username);

            const user1 = await prisma.customer.create({
                data: {
                    email: email,
                    username: username,
                    passwordHash: passwordHash,
                },
            });

            const cart1 = await prisma.cart.create({
                data: {
                    owner: {
                        connect: {
                            id: user1?.id,
                        },
                    },
                },
            })

            const profile1 = await prisma.profile.create({
                data: {
                    owner: {
                        connect: {
                            id: user1?.id
                        }
                    },
                    firstname: "",
                    lastname: "",
                    address: "",
                    phone: ""
                }
            })

            res.status(200).send({ message: "register successfully", status: "success" });

        } catch (error) {
            console.log(error)
        }

    }
)

registerRouter.use(errorMiddleware)

export default registerRouter;