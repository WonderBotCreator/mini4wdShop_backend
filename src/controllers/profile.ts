import * as jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { $Enums, PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import express, { NextFunction, response } from 'express';
import z from "zod";
import { AccessoryType, Mini4wdType, NewProduct, ProfileObject, profileSchema } from '../../types';
import { Request, Response } from 'express';

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



const newUserParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        profileSchema.parse(req.body);
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

profileRouter.put(
    '/',
    newUserParser
    ,
    async (request: Request<unknown, unknown, ProfileObject>, response: Response<Object>) => {
        try {
           const {firstname, lastname, address, phone} = request.body;

    const token = getTokenFrom(request.get('authorization'))


    let userID = undefined
    if (token !== null) {
        
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
    }})

    const updateProfile = await prisma.profile.update({
        where:{
            id: user?.profile?.id
        },
        data:{
            firstname: firstname,
            lastname: lastname,
            address: address,
            phone: phone
        }
    })

    response.status(200).send({message: "update profile successfully", status: "success"})

        } catch (error) {
            console.log(error)
        }

    }
)

// profileRouter.put('/', async(request, response)=>{
//     const {firstname, lastname, address, phone} = request.body;

//     const token = getTokenFrom(request.get('authorization'))


//     let userID = undefined
//     if (token !== null) {
        
//         userID = userIdFromJWT(token)
//     }

//     if (userID === undefined) {
//         response.status(400).send({ message: "Error add book" })
//         return
//     }

//     const user = await prisma.customer.findUnique({
//         where: {
//             id: userID
//         },
//         include: {
//             cart: true,
//             profile: true
//     }})

//     const updateProfile = await prisma.profile.update({
//         where:{
//             id: user?.profile?.id
//         },
//         data:{
//             firstname: firstname,
//             lastname: lastname,
//             address: address,
//             phone: phone
//         }
//     })

//     response.status(200).send({message: "update profile successfully", status: "success"})
// })

profileRouter.use(errorMiddleware)

export default profileRouter