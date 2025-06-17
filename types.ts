import z from "zod";


export const userSchema = z.object({
    username: z.string({required_error: "Username is required"}).min(3, "Username must have at least 3 characters").regex(new RegExp('^[a-zA-Z0-9]+$'), "No special characters allowed for username"),
    email: z.string({required_error: "Email is required"}).email('This email is invalid'),
    password: z.string({required_error: "Password is required"}).min(8, 'Password must have at least 8 characters').max(32, 'Password must be up to 32 characters'),
})

export const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stock:z.number(),
    image:z.string()
})


export const profileSchema = z.object({
    firstname: z.string({required_error: "firstname is required"}),
    lastname: z.string({required_error: "lastname is required"}),
    address: z.string({required_error: "address is required"}),
    phone: z.string({required_error: "phone is required"})
})


// export const loginSchema = z.object({
//     username: z.string()
// })

export type NewProduct = z.infer<typeof productSchema>;

export type ProfileObject = z.infer<typeof profileSchema>;

export interface AccessoryType extends NewProduct{
    accessoryType: string,
}

export interface Mini4wdType extends NewProduct{
    chassisType: string,
}

export type NewUser = z.infer<typeof userSchema>;

export interface User extends NewUser{
    id: string,
}