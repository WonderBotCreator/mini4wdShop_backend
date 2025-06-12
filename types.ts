import z from "zod";


export const userSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
})


// export const loginSchema = z.object({
//     username: z.string()
// })

export type NewUser = z.infer<typeof userSchema>;

export interface User extends NewUser{
    id: string,
}