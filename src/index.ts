import {load} from 'ts-dotenv';
import { PrismaClient } from "@prisma/client";
import express from 'express';
const env = load({
    PORT: Number,
});
const prisma = new PrismaClient()
const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
});

app.get('/feed', async (req, res) => {
    const posts = await prisma.post.findMany({
        where: { published:true },
        include: { author:true }
    });
    res.status(200).json(posts);
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const post = await prisma.post.findUnique({
        where:{ id: Number(id)},
    });
    res.status(200).json(post);
});

app.post('/user',async (req, res) => {
    const result = await prisma.user.create({
        data: {...req.body}
    });

    res.status(201).json(result);
});

app.post('/post', async (req, res) => {
    const { title, content, authorEmail } = req.body
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        author: { connect: { email: authorEmail } },
      },
    });
    res.status(201).json(result);
});

app.put('/post/publish/:id', async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { published: true },
    });
    res.status(200).json(post);
});
  
app.delete('/post/:id', async (req, res) => {
const { id } = req.params
const post = await prisma.post.delete({
    where: { id: Number(id) },
})
res.json(post)
})

app.listen(3000, () => console.log(`Rest API executando em http://localhost:${env.PORT}`));