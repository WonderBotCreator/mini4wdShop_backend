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

const cartRouter = express.Router()

cartRouter.get('/', async(request, response)=>{
     
    const token = getTokenFrom(request.get('authorization'))
    //let decodedToken: DecodedToken|null = null;

    let userID = undefined
    if(token!== null)
    {
         //decodedToken = jwt.verify(token, process.env.SECRET as string) 
         userID = userIdFromJWT(token)
    }
   
    if(userID === undefined)
    {
        response.status(400).send({message: "Error add book"})
        return
    }
    
    const user = await prisma.customer.findUnique({
        where:{
            id: userID
        },
        include:{
            cart: true
        }
    })

    let products = []

     const cart = await prisma.cart.findFirst({
      where:{
        owner:{
          id: user?.id
        }
      },
      include:{
        cartItems: true
      }
    })

    if(cart?.cartItems.length)
    {
        const itemLength:number|0 =  cart?.cartItems.length

        for(let i = 0;i< itemLength;i++)
        {
            const product = await prisma.product.findUnique({
                where:{
                    id: cart?.cartItems[i].productId
                }
            })

            console.log(product)

            products.push({product: product, amount: cart?.cartItems[i].amount})
        }
    }
    
    response.status(200).send({products: products, message: "get cart successfully", status: "success"})

    
})


cartRouter.post('/', async(request, response)=>{
    const { productID, amount } = request.body;

    
    const token = getTokenFrom(request.get('authorization'))
    //let decodedToken: DecodedToken|null = null;

    let userID = undefined
    if(token!== null)
    {
         //decodedToken = jwt.verify(token, process.env.SECRET as string) 
         userID = userIdFromJWT(token)
    }
   
    if(userID === undefined)
    {
        response.status(400).send({message: "Error add book"})
        return
    }
    
    const user = await prisma.customer.findUnique({
        where:{
            id: userID
        },
        include:{
            cart: true
        }
    })

    console.log(user)

    const cartItemObject = await prisma.cartItem.create({
        data:{
            productId: productID,
            amount: parseInt(amount),
            cart:{
                connect:{
                    id: user?.cart?.id
                }
            }
        }
    }) 
    console.log("add item to cart successfull")

    response.status(200).send({ message: "add item to cart successfully", status: "success" });
})


export default cartRouter