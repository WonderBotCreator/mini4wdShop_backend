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

const shopOwnerRouter = express.Router()


shopOwnerRouter.get('/order', async(request, response)=>{
    
    const token = getTokenFrom(request.get('authorization'))
    //let decodedToken: DecodedToken|null = null;

    let userID = undefined
    if (token !== null) {
        //decodedToken = jwt.verify(token, process.env.SECRET as string) 
        userID = userIdFromJWT(token)
    }

    if (userID === undefined) {
        response.status(400).send({ message: "Error cannot find any user", status: "error" })
        return
    }

    const user = await prisma.shopOwner.findUnique({
        where: {
            id: userID
        },
    })

    if(!user)
    {
        response.status(400).send({ message: "Error cannot find any user", status: "error" })
        return
    }

    const orders = await prisma.order.findMany({})

    response.status(200).send({orders: orders, message: "get orders successfully", status: "success"})
})



shopOwnerRouter.post('/login', async(request, response)=>{

     const { email, password } = request.body;
        const user = await prisma.shopOwner.findUnique({
            where: {
                email: email,
            },
        })
    
    
        const passwordCorrect = user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash)
    
        if (!(user && passwordCorrect)) {
            response.status(400).send({error: [{message: "username or password is invalid"}], status: "error" })
            return
        }
    
        const userForToken = {
            username: user?.username,
            id: user?.id
        }
    
        const token = jwt.sign(userForToken, process.env.SECRET as string, {expiresIn: 60*60})
    
        response.status(200).send({token, username: user?.username, status: "success"})
})



shopOwnerRouter.post('/', async(request, response)=>{
    
    const { username, email, password } = request.body;

     const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const shopOwnerObject = await prisma.shopOwner.create({
        data:{
            email: email,
            username: username,
            passwordHash: passwordHash,
        }
    })

    response.status(200).send({message: "register shopOwner  successfully", status: "success"})
})






export default shopOwnerRouter