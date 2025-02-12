import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const signup = async (req: any, res: any) => {
  const { name, email, posts } = req.body;

  const postData = posts?.map((post: Prisma.PostCreateInput) => {
    return { title: post?.title, content: post?.content };
  });

  const result = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: postData,
      },
    },
  });
  res.json(result);
};

export const getUsers = async (req: any, res: any) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const getUserById = async (req: any, res: any) => {
  const { id } = req.params;

  const drafts = await prisma.user
    .findUnique({
      where: {
        id: Number(id),
      },
    })
    .posts({
      where: { published: false },
    });

  res.json(drafts);
};
