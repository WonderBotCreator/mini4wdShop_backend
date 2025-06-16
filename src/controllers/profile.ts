import * as jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { $Enums, PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import express, { NextFunction, response } from 'express';
import z from "zod";
import { AccessoryType, Mini4wdType, NewProduct } from '../../types';


const getTokenFrom = (auth: string | undefined): string | null => {

    if (auth && auth.startsWith('Bearer ')) {
        console.log(auth.replace('Bearer ', ''))
        return auth.replace('Bearer ', '')
    }
    return null;
}

declare module 'jsonwebtoken' {
    export interface UserIDJwtPayload extends jwt.JwtPayload {
        id: string
    }
}


const userIdFromJWT = (jwtToken: string): string | undefined => {
    try {
        const { id } = <jwt.UserIDJwtPayload>jwt.verify(jwtToken, process.env.SECRET as string)

        return id
    } catch (error) {
        return undefined
    }
}

const prisma = new PrismaClient()
    .$extends(withAccelerate());

const profileRouter = express.Router()

profileRouter.get('/', async (request, response) => {

    const token = getTokenFrom(request.get('authorization'))
    //let decodedToken: DecodedToken|null = null;

    let userID = undefined
    if (token !== null) {
        //decodedToken = jwt.verify(token, process.env.SECRET as string) 
        userID = userIdFromJWT(token)
    }

    if (userID === undefined) {
        response.status(400).send({ message: "Error add book" })
        return
    }

    const user = await prisma.customer.findUnique({
        where: {
            id: userID
        },
        include: {
            cart: true,
            profile: true
        }
    })

    response.status(200).send({ profile: user?.profile, message: "get profile successfully", status: "success" })


})



export default profileRouter