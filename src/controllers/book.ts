import * as jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import express, { NextFunction } from 'express';
import z from "zod";


const getTokenFrom = (auth:string|undefined): string|null=> {
    
    if(auth && auth.startsWith('Bearer ')){
        console.log(auth.replace('Bearer ',''))
        return auth.replace('Bearer ','')
    }
   return null;
}

const prisma = new PrismaClient()
    .$extends(withAccelerate());

const bookRouter = express.Router()

bookRouter.get('/', async(req, res)=>{
    res.status(200).send({message: "get book"})
})



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


bookRouter.post('/', async (req, res) => {
    const { title, description } = req.body;
    console.log("book request")
    const token = getTokenFrom(req.get('authorization'))
    //let decodedToken: DecodedToken|null = null;

    let userID = undefined
    if(token!== null)
    {
         //decodedToken = jwt.verify(token, process.env.SECRET as string) 
         userID = userIdFromJWT(token)
    }
   
    if(userID === undefined)
    {
        res.status(400).send({message: "Error add book"})
    }
    
    const user = await prisma.user.findUnique({
        where:{
            id: userID
        }
    })

    console.log(user)
    

    

    const newBook = await prisma.book.create({
    data: {
      title: title,
      description: description,
      author: {
        connect: {
          id: user?.id,
        },
      },
    },
  });


    res.status(200).send({message: "Add book successfully", status: "success"})
})

export default bookRouter;