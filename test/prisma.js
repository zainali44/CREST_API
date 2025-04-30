import {PrismaClient} from "../generated/prisma/edge.js";
const prisma = new PrismaClient()

const prismaConnection=async ()=>{
      const newUser = await prisma.user.create({
    data: {
      username: 'john_doe',
      email: 'john@example.com',
    },
  });
}

export default prismaConnection;

