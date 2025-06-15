import * as jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { $Enums,PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import express, { NextFunction, response } from 'express';
import z from "zod";
import { AccessoryType, Mini4wdType, NewProduct } from '../../types';


const getTokenFrom = (auth:string|undefined): string|null=> {
    
    if(auth && auth.startsWith('Bearer ')){
        console.log(auth.replace('Bearer ',''))
        return auth.replace('Bearer ','')
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

const mini4wdRouter = express.Router()



mini4wdRouter.get('/', async (request,response)=>{
    const allmini4wd = await prisma.mini4wd.findMany({
        include:{
      product:true
    }
    })

    response.status(200).send({products: allmini4wd,message: "get all mini4wd successfully", status: "success"})
})


mini4wdRouter.get('/:id', async(request, response)=>{
    const id = request.params.id
    const product = await prisma.mini4wd.findUnique({
      where:{
        id: id
      },
       include:{
      product:true
    }
    })

    response.status(200).send({product: product,message: "get mini4wd successfully", status: "success"})
})





export default mini4wdRouter;