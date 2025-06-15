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

const productRouter = express.Router()





const CreateCircuit = async(data:NewProduct)=>{
     const circuitObject = await prisma.circuit.create({
    data:{
      product:{
        create:{
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          image: data.image,
          type: $Enums.ProductType.Circuit,
        }
      }
    }
  })

  return circuitObject
}



const CreateTool = async(data:NewProduct)=>{
     const toolObject = await prisma.tool.create({
    data:{
      product:{
        create:{
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          image: data.image,
          type: $Enums.ProductType.Tool,
        }
      }
    }
  })

  return toolObject
}


const CreateAccessory = async(data:AccessoryType)=>{
     const accessoryObject = await prisma.accessory.create({
    data:{
    accessoryType: data.accessoryType,
      product:{
        create:{
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          image: data.image,
          type: $Enums.ProductType.Accessory,
        },
        
      }
    }
  })

  return accessoryObject
}

const CreateMini4wd = async(data:Mini4wdType)=>{
     const mini4wdObject = await prisma.mini4wd.create({
    data:{
    chassisType: data.chassisType,
      product:{
        create:{
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          image: data.image,
          type: $Enums.ProductType.Mini4wd,
        },
        
      }
    }
  })

  return  mini4wdObject
}



productRouter.get('/', async (request,response)=>{
     const allproduct = await prisma.product.findMany({})

    response.status(200).send({products: allproduct,message: "get all product successfully", status: "success"})
})


productRouter.get('/:id', async(request, response)=>{
    const id = request.params.id
    const product = await prisma.product.findUnique({
      where:{
        id: id
      }
    })

    response.status(200).send({product: product,message: "get product successfully", status: "success"})
})


const GetAllMini4wd = async()=>{
  const allmini4wd = await prisma.mini4wd.findMany({})
  return allmini4wd
}

const GetAllCircuit = async()=>{
  const allcircuit = await prisma.circuit.findMany({})
  return allcircuit
}

const GetAllTool = async()=>{
  const alltool = await prisma.tool.findMany({})
  return alltool
}


productRouter.post('/', async (req, res) => {
    const { name, description, price, stock, image, productType, accessoryType, chassisType } = req.body;

    let productTypeEnum = null;
    let newProduct = null
    switch(productType)
    {
        case "mini4wd": productTypeEnum = $Enums.ProductType.Mini4wd;
                        newProduct = await CreateMini4wd({ name, description, price, stock, image, chassisType})
                        break;
        case "accessory": productTypeEnum = $Enums.ProductType.Accessory;
                        newProduct = await CreateAccessory({ name, description, price, stock, image, accessoryType});
                        break;
        case "tool": productTypeEnum = $Enums.ProductType.Tool;
                        newProduct = await CreateTool({ name, description, price, stock, image});
                        break;
        case "circuit": productTypeEnum = $Enums.ProductType.Circuit;
                        newProduct = await CreateCircuit({ name, description, price, stock, image});
                        break;
    }




    res.status(200).send({message: "Add product successfully", status: "success"})
})

export default productRouter;