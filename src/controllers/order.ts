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

const orderRouter = express.Router()


orderRouter.get('/', async(request, response)=>{
    
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

    const user = await prisma.customer.findUnique({
        where: {
            id: userID
        },
        include: {
            cart: true,
            orders: true
        }
    })

    response.status(200).send({orders: user?.orders, message: "get orders successfully", status: "success"})
})


orderRouter.get('/:id', async(request, response)=>{
    const orderId = request.params.id
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

    const user = await prisma.customer.findUnique({
        where: {
            id: userID
        },
        include: {
            cart: true,
            orders: true
        }
    })

    const orderObject = await prisma.order.findUnique({
        where:{
            id: orderId
        },
        include:{
            orderItems: true
        }
    })

    let products = []

    if(orderObject?.orderItems)
    {
        for(let i = 0;i< orderObject?.orderItems.length;i++)
        {
            const product = await prisma.product.findUnique({
                where: {
                    id: orderObject?.orderItems[i].productId
                }
            })

            products.push({ itemId: orderObject?.orderItems[i].id, product: product, amount: orderObject?.orderItems[i].amount })

        }
    }

    

    response.status(200).send({order: orderObject, products: products, message: "get order successfully", status: "success"})
})




orderRouter.post('/', async (request, response) => {
    const { cart, address, phone } = request.body;


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

    const user = await prisma.customer.findUnique({
        where: {
            id: userID
        },
        include: {
            cart: true
        }
    })


    const orderObject = await prisma.order.create({
        data: {
            status: "wait for payment",
            address: address,
            phone: phone,
            owner: {
                connect: {
                    id: user?.id,
                },
            },
        }
    })

    
    for(let i = 0;i<cart.length;i++)
    {
        const cartItemObject = await prisma.orderItem.create({
            data: {
                productId: cart[i].product.id,
                amount: parseInt(cart[i].amount),
                order: {
                    connect: {
                        id: orderObject?.id
                    }
                }
            }
        })

        const deleteCartItem = await prisma.cartItem.delete({
        where: {
                id: cart[i].itemId
            }
        })
    }

    response.status(200).send({message: "submit order successfully", status: "success"})


})


export default orderRouter