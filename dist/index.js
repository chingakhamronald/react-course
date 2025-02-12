"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post(`/signup`, async (req, res) => {
    const { name, email, posts } = req.body;
    const postData = posts?.map((post) => {
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
});
app.post(`/post`, async (req, res) => {
    const { title, content, authorEmail } = req.body;
    const result = await prisma.post.create({
        data: {
            title,
            content,
            author: { connect: { email: authorEmail } },
        },
    });
    res.json(result);
});
app.put("/post/:id/views", async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.update({
            where: { id: Number(id) },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });
        res.json(post);
    }
    catch (error) {
        res.json({ error: `Post with ID ${id} does not exist in the database` });
    }
});
app.put("/publish/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const postData = await prisma.post.findUnique({
            where: { id: Number(id) },
            select: {
                published: true,
            },
        });
        const updatedPost = await prisma.post.update({
            where: { id: Number(id) || undefined },
            data: { published: !postData?.published },
        });
        res.json(updatedPost);
    }
    catch (error) {
        res.json({ error: `Post with ID ${id} does not exist in the database` });
    }
});
app.delete(`/post/:id`, async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.delete({
        where: {
            id: Number(id),
        },
    });
    res.json(post);
});
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});
app.get("/user/:id/drafts", async (req, res) => {
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
});
app.get(`/post/:id`, async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
        where: { id: Number(id) },
    });
    res.json(post);
});
app.get("/feed", async (req, res) => {
    const { searchString, skip, take, orderBy } = req.query;
    const or = searchString
        ? {
            OR: [
                { title: { contains: searchString } },
                { content: { contains: searchString } },
            ],
        }
        : {};
    const posts = await prisma.post.findMany({
        where: {
            published: true,
            ...or,
        },
        include: { author: true },
        take: Number(take) || undefined,
        skip: Number(skip) || undefined,
        orderBy: {
            updatedAt: orderBy,
        },
    });
    res.json(posts);
});
const server = app.listen(3000, () => console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`));
