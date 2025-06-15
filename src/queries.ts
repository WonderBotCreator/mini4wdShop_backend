import { $Enums, PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient()
  .$extends(withAccelerate());

// // A `main` function so that we can use async/await
async function main() {

//   const user1Email = `alice${Date.now()}@prisma.io`;
//   const user2Email = `bob${Date.now()}@prisma.io`;

  


  
    
  // const circuit1 = await prisma.circuit.create({
  //   data:{
  //     product:{
  //       create:{
  //         name: "Circuit 1",
  //         description: "First Circuit",
  //         price: 120,
  //         stock: 20,
  //         image: "https://ucarecdn.com/00fc9333-f3c9-4c4f-bb2f-2f11839e9997/MINI4WDJAPANCUPJUNIORCIRCUITSPECIALCOLOREDITIONYELLOW.jpg",
  //         type: $Enums.ProductType.Circuit,
  //       }
  //     }
  //   }
  // })

  // const circuit1 = await prisma.circuit.findUnique({
  //   where:{
  //     id: "f5eaa8ff-5a99-423d-ae6a-e513f12024ec",
  //   },
  //   include:{
  //     product:true
  //   }
  // })

  // console.log(circuit1)

  // const allproduct = await prisma.product.findMany({
  //   include:{
  //     mini4wd: true,
  //     accessory: true,
  //     circuit: true,
  //     tool: true
  //   }
  // })
  //   console.log(allproduct)

// const allmini4wd = await prisma.mini4wd.findMany({
//   include:{
//     product: true
//   }
// })
// console.log(allmini4wd)

// const user = await prisma.customer.findUnique({
//         where:{
//             id: '2de9afea-a743-4de8-bed2-42082ac68afd'
//         },
//         include:{
//             cart: true
//         }
//     })

//     const cart = await prisma.cart.findFirst({
//       where:{
//         owner:{
//           id: user?.id
//         }
//       },
//       include:{
//         cartItems: true
//       }
//     })

// console.log(cart)


//   // Seed the database with users and posts
//   const user1 = await prisma.user.create({
//     data: {
//       email: user1Email,
//       name: 'Alice',
//       posts: {
//         create: {
//           title: 'Join the Prisma community on Discord',
//           content: 'https://pris.ly/discord',
//           published: true,
//         },
//       },
//     },
//     include: {
//       posts: true,
//     },
//   });
//   const user2 = await prisma.user.create({
//     data: {
//       email: user2Email,
//       name: 'Bob',
//       posts: {
//         create: [
//           {
//             title: 'Check out Prisma on YouTube',
//             content: 'https://pris.ly/youtube',
//             published: true,
//           },
//           {
//             title: 'Follow Prisma on Twitter',
//             content: 'https://twitter.com/prisma/',
//             published: false,
//           },
//         ],
//       },
//     },
//     include: {
//       posts: true,
//     },
//   });
//   console.log(
//     `Created users: ${user1.name} (${user1.posts.length} post) and ${user2.name} (${user2.posts.length} posts) `,
//   );

//   // Retrieve all published posts
//   const allPosts = await prisma.post.findMany({
//     where: { published: true },
//   });
//   console.log(`Retrieved all published posts: ${JSON.stringify(allPosts)}`);

//   // Create a new post (written by an already existing user with email alice@prisma.io)
//   const newPost = await prisma.post.create({
//     data: {
//       title: 'Join the Prisma Discord community',
//       content: 'https://pris.ly/discord',
//       published: false,
//       author: {
//         connect: {
//           email: user1Email,
//         },
//       },
//     },
//   });
//   console.log(`Created a new post: ${JSON.stringify(newPost)}`);

//   // Publish the new post
//   const updatedPost = await prisma.post.update({
//     where: {
//       id: newPost.id,
//     },
//     data: {
//       published: true,
//     },
//   });
//   console.log(`Published the newly created post: ${JSON.stringify(updatedPost)}`);

//   // Retrieve all posts by user with email alice@prisma.io
//   const postsByUser = await prisma.post
//     .findMany({
//       where: {
//         author: {
//           email: user1Email
//         }
//       },
//     });
//   console.log(`Retrieved all posts from a specific user: ${JSON.stringify(postsByUser)}`);

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
