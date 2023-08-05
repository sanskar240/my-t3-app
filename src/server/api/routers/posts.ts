
import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) =>{
  return{id:user.id, name:user.username,profileImageUrl:user.imageUrl}
};

export const postRouter = createTRPCRouter({


  getAll: publicProcedure.query(async({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
   const posts =  await ctx.prisma.post.findMany({
    take:100
   });
   const users = (await clerkClient.users.getUserList({
    userId:posts.map((post)=>post.authorId),
    limit:100
   
    
   })).map(filterUserForClient)
   //after logging users to the console u need to filter out most of the 
   //parameters
   console.log(users);

   //now map the filtered user parameters(the ones u wanna show) to the client
   posts.map((post)=>({
    post,
    author:users.find((user)=>user.id === post.authorId)
   }))

   return posts;
   
  }),
});
